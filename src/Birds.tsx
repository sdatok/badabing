import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const Birds = () => {
    const sketchRef = useRef();

    useEffect(() => {
        let myp5; // Declare a variable to hold your p5 instance

        const sketch = (p) => {
            let boids = [];

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight);
                for (let i = 0; i < 300; i++) { // Increase number of boids
                    boids.push(new Boid(p));
                }
            };

            p.draw = () => {
                p.background(100);
                boids.forEach((boid) => {
                    boid.edges();
                    boid.flock(boids);
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

                align(boids) {
                    let perceptionRadius = 50;
                    let steering = this.p.createVector();
                    let total = 0;
                    for (let other of boids) {
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (other != this && d < perceptionRadius) {
                            steering.add(other.velocity);
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

                // Implement cohesion
                cohesion(boids) {
                    let perceptionRadius = 100; // Adjust as needed
                    let steering = this.p.createVector();
                    let total = 0;
                    for (let other of boids) {
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (other != this && d < perceptionRadius) {
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
                separation(boids) {
                    let perceptionRadius = 50; // Smaller radius for separation
                    let steering = this.p.createVector();
                    let total = 0;
                    for (let other of boids) {
                        let d = this.p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
                        if (other != this && d < perceptionRadius) {
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

                flock(boids) {
                    let alignment = this.align(boids);
                    let cohesion = this.cohesion(boids);
                    let separation = this.separation(boids);

                    separation.mult(1.5); // Increase separation slightly if they get too close
                    cohesion.mult(1.7); // Increase cohesion to keep the group tighter

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
    return <div ref={sketchRef} className="flex justify-center items-center mt-20 container mx-auto h-screen"></div>;
};

export default Birds;
