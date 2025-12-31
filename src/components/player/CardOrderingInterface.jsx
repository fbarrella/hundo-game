import React, { useState, useEffect } from 'react';
import { updateCardPosition } from '../../services/gameService';
import { getAllCardsInOrder } from '../../utils/cardUtils';
import './CardOrderingInterface.css';

function OrderableCard({ card, isPlayerCard, onMoveUp, onMoveDown, canMoveUp, canMoveDown, isUpdating }) {
    return (
        <div className={`sortable-card ${isPlayerCard ? 'player-card' : 'other-card'}`}>
            <div className="card-position">{card.position + 1}</div>
            <div className="card-info">
                {isPlayerCard ? (
                    <>
                        <div className="card-label">Your Card</div>
                        <div className="card-number-large">{card.cardNumber}</div>
                    </>
                ) : (
                    <>
                        <div className="card-label">{card.playerName}</div>
                        <div className="card-placeholder">?</div>
                    </>
                )}
            </div>
            {isPlayerCard && (
                <div className="card-controls">
                    <button
                        className="arrow-button"
                        onClick={onMoveUp}
                        disabled={!canMoveUp || isUpdating}
                        aria-label="Move card up"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 5L15 10L13.5 11.5L10 8L6.5 11.5L5 10L10 5Z" fill="currentColor" />
                        </svg>
                    </button>
                    <button
                        className="arrow-button"
                        onClick={onMoveDown}
                        disabled={!canMoveDown || isUpdating}
                        aria-label="Move card down"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 15L5 10L6.5 8.5L10 12L13.5 8.5L15 10L10 15Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export default function CardOrderingInterface({
    roomId,
    playerId,
    playerCards,
    playerPositions,
    allPlayers
}) {
    const [orderedCards, setOrderedCards] = useState([]);
    const [updating, setUpdating] = useState(false);

    // Build the ordered cards list
    useEffect(() => {
        const allCards = getAllCardsInOrder(allPlayers);
        setOrderedCards(allCards);
    }, [allPlayers]);

    const moveCard = async (cardIndex, direction) => {
        const currentIndex = orderedCards.findIndex(
            c => c.playerId === playerId && c.cardIndex === cardIndex
        );

        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= orderedCards.length) return;

        // Optimistically update UI
        const newOrderedCards = [...orderedCards];
        const [movedCard] = newOrderedCards.splice(currentIndex, 1);
        newOrderedCards.splice(newIndex, 0, movedCard);

        // Update positions
        const updatedCards = newOrderedCards.map((card, index) => ({
            ...card,
            position: index
        }));

        setOrderedCards(updatedCards);

        // Update in Firebase
        setUpdating(true);
        try {
            const roomData = { players: allPlayers };
            await updateCardPosition(
                roomId,
                playerId,
                cardIndex,
                newIndex,
                roomData
            );
        } catch (error) {
            console.error('Failed to update card position:', error);
            // Revert on error
            const allCards = getAllCardsInOrder(allPlayers);
            setOrderedCards(allCards);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="card-ordering-interface">
            <h3>Card Order</h3>
            <p className="ordering-hint">
                Use the arrows to arrange your cards in the correct order
            </p>

            <div className="order-indicator-top">
                <div className="order-label">LOWEST</div>
                <div className="order-arrow">↓</div>
            </div>

            <div className="cards-order-list">
                {orderedCards.map((card, index) => {
                    const isPlayerCard = card.playerId === playerId;
                    const canMoveUp = index > 0;
                    const canMoveDown = index < orderedCards.length - 1;

                    return (
                        <OrderableCard
                            key={`${card.playerId}-${card.cardIndex}`}
                            card={card}
                            isPlayerCard={isPlayerCard}
                            onMoveUp={() => moveCard(card.cardIndex, 'up')}
                            onMoveDown={() => moveCard(card.cardIndex, 'down')}
                            canMoveUp={canMoveUp}
                            canMoveDown={canMoveDown}
                            isUpdating={updating}
                        />
                    );
                })}
            </div>

            <div className="order-indicator-bottom">
                <div className="order-arrow">↓</div>
                <div className="order-label">HIGHEST</div>
            </div>

            {updating && (
                <div className="updating-indicator">
                    <div className="spinner-small"></div>
                    Updating...
                </div>
            )}
        </div>
    );
}
