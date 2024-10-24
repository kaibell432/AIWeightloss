import React from 'react';
import { Button, Icon, Grid, Segment, Header, List, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import './css/Home.css';

function Home ({ isAuthenticated }) {
    
    return (
        <div className="homepage">
            <div className="hero-section">
                <Container text>
                    <h1 className="home-header">
                        Achieve Your Weight Goals
                    </h1>
                    <p className="hero-subtitle">
                        Personalized weight management suggestions and meal plans tools to support your journey.
                    </p>
                    <Button size="large" as={Link} to={isAuthenticated ? '/account' : '/register'}>
                        Get Started!
                        <Icon name="arrow right" />
                    </Button>
                </Container>
            </div>

        <Segment vertical className="features-section">
            <Container>
                <Header as="h2" textAlign="center">
                    Features
                </Header>
                <Grid stackable columns={2} divided>
                    <Grid.Row>
                        <Grid.Column textAlign="center">
                            <Icon name="weight" size="huge" color="teal" />
                            <Header as="h3">Personalized Weight Management</Header>
                            <p>Get suggestions for your weight goals tailored to you!</p>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            <Icon name="food" size="huge" color="grey" />
                            <Header as="h3">Customized Meal Plans</Header>
                            <p>Generate and save meal plans tailored to your dietary preferences!</p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>

        <Segment vertical className="benefits-section">
            <Container text>
                <Header as="h2" textAlign="center">
                    Why Choose Us?
                </Header>
                <List bulleted size="medium">
                    <List.Item>Personalized approach to weight management.</List.Item>
                    <List.Item>Easy-to-follow meal plans.</List.Item>
                    <List.Item>Access to expert tips and advice.</List.Item>
                </List>
            </Container>
        </Segment>

        <Segment vertical className="testimonials-section">
            <Container>
                <Header as="h2" textAlign="center">
                    What Our Users Say
                </Header>
                <Grid stackable columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment>
                                <p>"This app helped me lose ___ in ___!"</p>
                                <p><strong>- Name</strong></p>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment>
                                <p>"The meal plans are easy and delicious!"</p>
                                <p><strong>- Name</strong></p>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
        
        <Segment vertical textAlign="center" className="cta-section">
            <Container>
                <Header as="h2">Ready to Start Your Journey?</Header>
                <Button size="huge" as={Link} to={isAuthenticated ? '/account' : '/register'}>
                    Sign Up Now!
                </Button>
            </Container>
        </Segment>
        </div>
    )
}

export default Home;