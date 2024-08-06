import { useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';
import React from 'react';

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;

    useEffect(() => {
        getMovieData(movieId);
    }, [movieId, getMovieData]);

    const addReview = async (e) => {
        e.preventDefault();
        const reviewText = revText.current.value.trim();

        if (!reviewText) {
            alert("Review cannot be empty");
            return;
        }

        try {
            console.log("Sending review:", reviewText);
            const response = await api.post("/api/v1/reviews", { reviewBody: reviewText, imdbId: movieId });

            if (response.status === 201) {
                const updatedReviews = [...reviews, { reviewBody: reviewText, id: response.data.id }];
                revText.current.value = "";
                setReviews(updatedReviews);
            } else {
                console.error("Failed to add review:", response);
            }
        } catch (err) {
            console.error("Error during request:", err);
        }
    }

    return (
        <Container>
            <Row>
                <Col><h3>Reviews</h3></Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <img src={movie?.poster} alt="" />
                </Col>
                <Col>
                    <>
                        <Row>
                            <Col>
                                <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write a Review?" />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr />
                            </Col>
                        </Row>
                    </>
                    {reviews?.map((r, index) => (
                        <React.Fragment key={r.id || `review-${index}`}>
                            <Row>
                                <Col>{r.reviewBody}</Col>
                            </Row>
                            <Row>
                                <Col>
                                    <hr />
                                </Col>
                            </Row>
                        </React.Fragment>
                    ))}
                </Col>
            </Row>
            <Row>
                <Col>
                    <hr />
                </Col>
            </Row>
        </Container>
    );
}

export default Reviews;
