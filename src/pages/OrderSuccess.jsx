import React, { useEffect, useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { db } from '../../firebaseConfig'; // Adjust path as needed
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const OrderSuccess = () => {
    const [orderId, setOrderId] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState({
        name: '',
        email: '',
        text: ''
    });
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [orderSaved, setOrderSaved] = useState(false); // Add this state to track if order is already saved
    const { currentUser } = useAuth();

    useEffect(() => {
        // Generate order ID only once
        const id = `GG${Date.now().toString().slice(-8)}`;
        setOrderId(id);

        const eta = new Date();
        eta.setHours(eta.getHours() + 2);
        setDeliveryTime(eta.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }));

        startConfetti();
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < 2) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []); // Remove currentUser dependency

    // Separate useEffect for saving order when both orderId and currentUser are available
    useEffect(() => {
        if (orderId && currentUser && !orderSaved) {
            saveOrderToUserOrders();
        }
    }, [orderId, currentUser, orderSaved]);

    const saveOrderToUserOrders = async () => {
        if (!currentUser || !orderId || orderSaved) {
            console.log('Cannot save order - missing data or already saved');
            return;
        }

        try {
            setOrderSaved(true); // Set this immediately to prevent duplicate calls

            const orderData = {
                orderId: orderId,
                status: 'confirmed',
                placedAt: new Date().toISOString(),
                estimatedDelivery: deliveryTime,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                // Add other order details here like items, total amount, etc.
                orderDetails: {
                    // You can pass order details from props or context
                    // items: orderItems,
                    // totalAmount: totalAmount,
                    // deliveryAddress: deliveryAddress,
                },
                currentStep: 0 // Order confirmed
            };

            // Save under users/{userId}/orders/{orderId}
            const userOrderRef = ref(db, `users/${currentUser.uid}/orders/${orderId}`);
            await set(userOrderRef, orderData);

            // Also save in a general orders collection for admin purposes (optional)
            const allOrdersRef = ref(db, `allOrders/${orderId}`);
            await set(allOrdersRef, {
                ...orderData,
                userId: currentUser.uid
            });

            console.log('Order saved successfully under user:', currentUser.uid);
        } catch (error) {
            console.error('Error saving order:', error);
            setOrderSaved(false); // Reset on error so it can be retried
        }
    };

    const startConfetti = () => {
        const container = document.getElementById('confettiContainer');
        if (container) {
            container.classList.add('active');
            for (let i = 0; i < 50; i++) {
                const div = document.createElement('div');
                div.className = 'confetti';
                div.style.left = Math.random() * 100 + '%';
                div.style.animationDelay = Math.random() * 3 + 's';
                div.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
                container.appendChild(div);
            }
        }
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `review-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 3000);
    };

    const handleReviewSubmit = async () => {
        if (!review.name.trim()) return setError('Please enter your name');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.email)) return setError('Invalid email');
        if (userRating === 0) return setError('Please select a rating');
        
        setError('');
        setSubmitting(true);

        try {
            const reviewData = {
                orderId: orderId,
                userId: currentUser?.uid || null,
                userName: review.name.trim(),
                userEmail: review.email.trim(),
                rating: userRating,
                reviewText: review.text.trim(),
                submittedAt: new Date().toISOString(),
                deliveryTime: deliveryTime,
                verified: currentUser ? true : false
            };

            // Save review to general reviews collection
            const reviewsRef = ref(db, 'reviews');
            const newReviewRef = push(reviewsRef);
            await set(newReviewRef, reviewData);

            // Also save review under user's profile if logged in
            if (currentUser) {
                const userReviewRef = ref(db, `users/${currentUser.uid}/reviews/${newReviewRef.key}`);
                await set(userReviewRef, {
                    ...reviewData,
                    reviewId: newReviewRef.key
                });

                // Update the order with review info
                const orderReviewRef = ref(db, `users/${currentUser.uid}/orders/${orderId}/review`);
                await set(orderReviewRef, {
                    rating: userRating,
                    reviewText: review.text.trim(),
                    reviewId: newReviewRef.key,
                    reviewedAt: new Date().toISOString()
                });
            }

            setSubmitted(true);
            showNotification('Thank you for your review! It has been saved successfully.');
            
            // Clear form data
            setReview({ name: '', email: '', text: '' });
            setUserRating(0);
            
        } catch (error) {
            console.error('Error saving review:', error);
            setError('Failed to submit review. Please try again.');
            showNotification('Failed to submit review. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ rating, onRatingChange, onHover, hoverValue }) => {
        return (
            <div className="rating-container">
                <div className="rating-label">Rate your experience:</div>
                <div className="star-rating-wrapper">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`star-button ${(hoverValue || rating) >= star ? 'filled' : 'empty'}`}
                            onClick={() => onRatingChange(star)}
                            onMouseEnter={() => onHover(star)}
                            onMouseLeave={() => onHover(0)}
                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            disabled={submitting}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" className="star-svg">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <div className="rating-text">
                        You rated: {rating} star{rating > 1 ? 's' : ''} - {
                            rating === 1 ? 'Poor' :
                            rating === 2 ? 'Fair' :
                            rating === 3 ? 'Good' :
                            rating === 4 ? 'Very Good' : 'Excellent'
                        }
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#222',
            padding: '2rem 0',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
        }}>
            <div id="confettiContainer" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
            
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 1rem',
                position: 'relative',
                zIndex: 2
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            background: '#333',
                            border: '3px solid #ff8800',
                            borderRadius: '50%',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                        }}>
                            <div style={{
                                width: '30px',
                                height: '15px',
                                border: '4px solid #ff8800',
                                borderTop: 'none',
                                borderRight: 'none',
                                transform: 'rotate(-45deg)'
                            }}></div>
                        </div>
                    </div>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>Order Placed Successfully!</h1>
                    <p style={{ color: '#ccc', fontSize: '1.1rem' }}>Thank you for shopping with GroceryGo</p>
                    
                    {currentUser && orderSaved && (
                        <div style={{
                            background: '#333',
                            border: '1px solid #444',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginTop: '1rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ color: '#4CAF50', fontSize: '1.2rem' }}>✓</span>
                            <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                                Order saved to your account: {currentUser.email}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '1.5rem',
                        borderBottom: '2px solid #444'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem',
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '12px'
                        }}>
                            <span style={{ display: 'block', color: '#999', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Order ID:
                            </span>
                            <span style={{ display: 'block', color: '#fff', fontSize: '1.125rem', fontWeight: '700' }}>
                                {orderId}
                            </span>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem',
                            background: '#222',
                            border: '1px solid #444',
                            borderRadius: '12px'
                        }}>
                            <span style={{ display: 'block', color: '#999', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                Estimated Delivery:
                            </span>
                            <span style={{ display: 'block', color: '#fff', fontSize: '1.125rem', fontWeight: '700' }}>
                                {deliveryTime}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ color: '#fff', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                            Order Status
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {["Order Confirmed", "Preparing", "Out for Delivery"].map((title, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    position: 'relative',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: currentStep >= idx ? '#ff8800' : '#222',
                                    border: '1px solid #444',
                                    transform: currentStep >= idx ? 'translateX(5px)' : 'none',
                                    boxShadow: currentStep >= idx ? '0 2px 8px rgba(255, 136, 0, 0.3)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        marginRight: '0.75rem',
                                        minWidth: '45px',
                                        textAlign: 'center'
                                    }}>
                                        {["📋", "👨‍🍳", "🚚"][idx]}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '600',
                                            color: '#fff',
                                            marginBottom: '0.125rem',
                                            fontSize: '0.95rem'
                                        }}>
                                            {title}
                                        </div>
                                        <div style={{ color: '#ccc', fontSize: '0.8rem' }}>
                                            {["Your order has been received", "Items are being prepared", "Your order is on the way"][idx]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        background: '#ff8800',
                        color: '#fff',
                        boxShadow: '0 4px 15px rgba(255, 136, 0, 0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>🏠</span>
                        Continue Shopping
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        background: '#333',
                        color: '#fff',
                        border: '2px solid #ff8800',
                        transition: 'all 0.3s ease'
                    }}>
                        <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>📦</span>
                        View Orders
                    </button>
                </div>

                <div style={{
                    background: '#333',
                    border: '1px solid #444',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center'
                }}>
                    {!submitted ? (
                        <div>
                            <h3 style={{
                                color: '#fff',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                marginBottom: '1rem'
                            }}>
                                How was your experience?
                            </h3>
                            
                            {currentUser && (
                                <div style={{
                                    background: '#444',
                                    border: '1px solid #555',
                                    borderRadius: '8px',
                                    padding: '0.75rem',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span style={{ color: '#4CAF50', fontSize: '1.2rem' }}>✓</span>
                                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
                                        Logged in as verified user
                                    </span>
                                </div>
                            )}
                            
                            <div style={{
                                marginBottom: '1.5rem',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1rem'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={review.name}
                                    onChange={e => setReview({ ...review, name: e.target.value })}
                                    disabled={submitting}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #444',
                                        borderRadius: '8px',
                                        background: submitting ? '#111' : '#222',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        opacity: submitting ? 0.6 : 1
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={review.email}
                                    onChange={e => setReview({ ...review, email: e.target.value })}
                                    disabled={submitting}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #444',
                                        borderRadius: '8px',
                                        background: submitting ? '#111' : '#222',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        opacity: submitting ? 0.6 : 1
                                    }}
                                />
                            </div>

                            <StarRating 
                                rating={userRating}
                                onRatingChange={setUserRating}
                                onHover={setHoverRating}
                                hoverValue={hoverRating}
                            />

                            <textarea
                                placeholder="Share your feedback (optional)"
                                value={review.text}
                                onChange={e => setReview({ ...review, text: e.target.value })}
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    padding: '1rem',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    background: submitting ? '#111' : '#222',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    marginBottom: '1rem',
                                    marginTop: '1rem',
                                    opacity: submitting ? 0.6 : 1
                                }}
                            />

                            <button
                                onClick={handleReviewSubmit}
                                disabled={submitting}
                                style={{
                                    background: submitting ? '#666' : '#ff8800',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    opacity: submitting ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto'
                                }}
                            >
                                {submitting && (
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #fff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                )}
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            
                            {error && (
                                <div style={{
                                    color: '#ff6b6b',
                                    fontSize: '0.875rem',
                                    marginTop: '0.5rem',
                                    background: 'rgba(255, 107, 107, 0.1)',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid rgba(255, 107, 107, 0.3)'
                                }}>
                                    {error}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{
                                fontSize: '4rem',
                                color: '#ff8800',
                                marginBottom: '1rem'
                            }}>
                                ✓
                            </div>
                            <p style={{
                                color: '#fff',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                Thank you for your feedback!
                            </p>
                            <p style={{ color: '#ccc', fontSize: '1rem', marginBottom: '1rem' }}>
                                Your review has been saved and helps us improve our service.
                            </p>
                            <p style={{ 
                                color: '#999',
                                fontSize: '0.875rem',
                                background: '#222',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #444'
                            }}>
                                Review ID: {orderId}-review
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .confetti {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    opacity: 0;
                }

                .confetti-container.active .confetti {
                    animation: confetti-fall 3s linear forwards;
                }

                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .rating-container {
                    margin: 1.5rem 0;
                }

                .rating-label {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .star-rating-wrapper {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: 1rem;
                }

                .star-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s ease;
                    border-radius: 50%;
                }

                .star-button:not(:disabled):hover {
                    transform: scale(1.1);
                    background: rgba(255, 136, 0, 0.1);
                }

                .star-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }

                .star-button:focus {
                    outline: 2px solid #ff8800;
                    outline-offset: 2px;
                }

                .star-svg {
                    transition: all 0.2s ease;
                }

                .star-button.filled .star-svg {
                    fill: #ff8800;
                    stroke: #ff6600;
                    stroke-width: 1;
                    filter: drop-shadow(0 0 6px rgba(255, 136, 0, 0.5));
                }

                .star-button.empty .star-svg {
                    fill: transparent;
                    stroke: #666;
                    stroke-width: 2;
                }

                .star-button.empty:not(:disabled):hover .star-svg {
                    stroke: #ff8800;
                    fill: rgba(255, 136, 0, 0.2);
                }

                .rating-text {
                    color: #ff8800;
                    font-size: 1rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .star-rating-wrapper {
                        gap: 12px;
                    }
                    
                    .star-svg {
                        width: 28px;
                        height: 28px;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;