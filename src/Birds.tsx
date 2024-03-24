class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x < this.x + this.width &&
            point.y >= this.y &&
            point.y < this.y + this.height
        );
    }
}


class Quadtree {
    constructor(boundary, capacity) {
        this.boundary = boundary; // An object { x, y, width, height }
        this.capacity = capacity; // Maximum number of points before subdividing
        this.points = []; // Points in this quadtree
        this.divided = false;
    }

    // Check if a point is within the bounds of this quadtree
    contains(point) {
        return (
            point.x >= this.boundary.x &&
            point.x < this.boundary.x + this.boundary.width &&
            point.y >= this.boundary.y &&
            point.y < this.boundary.y + this.boundary.height
        );
    }

    // Insert a point into the quadtree
    insert(point) {
        if (!this.contains(point)) {
            return false;
        }

        if (this.points.length < this.capacity) {
            this.points.push(point);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        return this.northeast.insert(point) ||
            this.northwest.insert(point) ||
            this.southeast.insert(point) ||
            this.southwest.insert(point);
    }

    // Subdivide the current quadtree into 4 quadtrees
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.width / 2;
        let h = this.boundary.height / 2;

        let ne = { x: x + w, y: y, width: w, height: h };
        this.northeast = new Quadtree(ne, this.capacity);

        let nw = { x: x, y: y, width: w, height: h };
        this.northwest = new Quadtree(nw, this.capacity);

        let se = { x: x + w, y: y + h, width: w, height: h };
        this.southeast = new Quadtree(se, this.capacity);

        let sw = { x: x, y: y + h, width: w, height: h };
        this.southwest = new Quadtree(sw, this.capacity);

        this.divided = true;
    }

    // Query the quadtree for points within a range
    query(range, found = []) {
        if (!this.intersects(range)) {
            return found;
        }

        for (let p of this.points) {
            if (range.contains(p)) {
                found.push(p);
            }
        }

        if (this.divided) {
            this.northwest.query(range, found);
            this.northeast.query(range, found);
            this.southwest.query(range, found);
            this.southeast.query(range, found);
        }

        return found;
    }

    // Check if a range intersects this quadtree
    intersects(range) {
        return !(
            range.x > this.boundary.x + this.boundary.width ||
            range.x + range.width < this.boundary.x ||
            range.y > this.boundary.y + this.boundary.height ||
            range.y + range.height < this.boundary.y
        );
    }
}


import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const Birds = () => {
    const sketchRef = useRef();

    useEffect(() => {
        let myp5; // Declare a variable to hold your p5 instance

        const sketch = (p) => {
            let boids = [];
            let quadtree;

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                quadtree = new Quadtree({x: 0, y: 0, width: p.width, height: p.height}, 4); // Adjust capacity as needed
                for (let i = 0; i < 300; i++) {
                    boids.push(new Boid(p));
                }
            };

            p.draw = () => {
                p.background(100);

                // Always re-instantiate the Quadtree every frame to account for moving boids
                quadtree = new Quadtree({x: 0, y: 0, width: p.width, height: p.height}, 4);
                boids.forEach(boid => {
                    let point = {x: boid.position.x, y: boid.position.y, boid: boid};
                    quadtree.insert(point);
                });

                // Update and show boids
                boids.forEach(boid => {
                    boid.edges();
                    boid.flock(quadtree); // Ensure flock method correctly uses the Quadtree
                    boid.update();
                    boid.show();
                });
            };



            class Boid {
                constructor(p) {
                    this.position = p.createVector(p.random(p.width), p.random(p.height));
                    this.velocity = p5.Vector.random2D();
                    this.velocity.setMag(p.random(8, 10));
                    this.acceleration = p.createVector();
                    this.maxForce = 0.3; // Increase the force for more dramatic turns
                    this.maxSpeed = 10;
                    this.p = p;
                }

                edges() {
                    const margin = 100; // Distance from the edge where birds start turning back
                    const turnForce = 1; // Strength of the turn back force
                    let turn = this.p.createVector(0, 0);

                    if (this.position.x < margin) {
                        turn.x = turnForce;
                    } else if (this.position.x > this.p.width - margin) {
                        turn.x = -turnForce;
                    }

                    if (this.position.y < margin) {
                        turn.y = turnForce;
                    } else if (this.position.y > this.p.height - margin) {
                        turn.y = -turnForce;
                    }

                    this.acceleration.add(turn);
                }

                align(quadtree) {
                    let perceptionRadius = 50;
                    let steering = this.p.createVector();
                    let total = 0;
                    let range = new Rectangle(this.position.x - perceptionRadius, this.position.y - perceptionRadius, perceptionRadius * 2, perceptionRadius * 2);
                    let points = quadtree.query(range);

                    points.forEach(point => {
                        let other = point.boid;
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (d < perceptionRadius && other !== this) {
                            steering.add(other.velocity);
                            total++;
                        }
                    });

                    if (total > 0) {
                        steering.div(total);
                        steering.setMag(this.maxSpeed);
                        steering.sub(this.velocity);
                        steering.limit(this.maxForce);
                    }
                    return steering;
                }


                // Implement cohesion
                cohesion(quadtree) {
                    let perceptionRadius = 100;
                    let steering = this.p.createVector();
                    let total = 0;
                    let range = new Rectangle(this.position.x - perceptionRadius, this.position.y - perceptionRadius, perceptionRadius * 2, perceptionRadius * 2);
                    let points = quadtree.query(range);

                    for (let point of points) {
                        let other = point.boid;
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (d < perceptionRadius) {
                            steering.add(other.position);
                            total++;
                        }
                    }

                    if (total > 0) {
                        steering.div(total);
                        steering.sub(this.position);
                        steering.setMag(this.maxSpeed);
                        steering.sub(this.velocity);
                        steering.limit(this.maxForce);
                    }
                    return steering;
                }


                // Implement separation
                separation(quadtree) {
                    let perceptionRadius = 50;
                    let steering = this.p.createVector();
                    let total = 0;
                    let range = new Rectangle(this.position.x - perceptionRadius, this.position.y - perceptionRadius, perceptionRadius * 2, perceptionRadius * 2);
                    let points = quadtree.query(range);

                    for (let point of points) {
                        let other = point.boid;
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (d < perceptionRadius && d > 0) { // Check d > 0 to exclude itself
                            let diff = p5.Vector.sub(this.position, other.position);
                            diff.div(d); // Weight by distance
                            steering.add(diff);
                            total++;
                        }
                    }

                    if (total > 0) {
                        steering.div(total);
                        steering.setMag(this.maxSpeed);
                        steering.sub(this.velocity);
                        steering.limit(this.maxForce);
                    }
                    return steering;
                }


                flock(quadtree) {
                    let alignment = this.align(quadtree);
                    let cohesion = this.cohesion(quadtree);
                    let separation = this.separation(quadtree);
                    // Apply forces
                    this.acceleration.add(alignment);
                    this.acceleration.add(cohesion);
                    this.acceleration.add(separation);
                }


                update() {
                    const randomForce = p5.Vector.random2D().mult(0.5); // Adjust strength as needed
                    this.acceleration.add(randomForce); // Add a bit of randomness to the movement

                    this.position.add(this.velocity);
                    this.velocity.add(this.acceleration);
                    this.velocity.limit(this.maxSpeed);
                    this.acceleration.mult(0); // Reset acceleration each frame
                }

                show() {
                    this.p.fill(0); // Black fill
                    this.p.noStroke();
                    this.p.circle(this.position.x, this.position.y, 4); // Draw boid as a small circle
                }

            }
        };

        // Create a new p5 instance and attach it to the sketchRef.current element
        myp5 = new p5(sketch, sketchRef.current); // Initialize the p5 instance and attach it to the div

        return () => {
            myp5.remove(); // This removes the p5 instance when the component unmounts or rerenders
        };
    }, []);

    // Returning a div that will contain the canvas. The className is for styling and layout
    return (
        <div className="simulation-container" style={{position: 'relative', width: '100%', height: '100%'}}>
            <div className="description-overlay">
                <h2>Flocking Simulation</h2>
                <p>
                    This simulation showcases the boids algorithm, a model for natural flocking behaviors observed in birds and fish. Through simple rules — alignment, cohesion, and separation — complex, dynamic patterns emerge, demonstrating the power of decentralized, self-organizing systems. Optimized with a quadtree for efficient computation, the simulation scales to thousands of entities, each independently navigating the canvas. Explore the fascinating interplay of individual autonomy and collective behavior.
                </p>
            </div>

            <div ref={sketchRef} className="simulation-canvas" style={{width: '100%', height: '100%'}}></div>
        </div>
    );};

export default Birds;
