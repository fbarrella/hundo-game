import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateCardPosition } from '../../services/gameService';
import { getAllCardsInOrder } from '../../utils/cardUtils';
import './CardOrderingInterface.css';

function SortableCard({ id, card, isPlayerCard }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`sortable-card ${isPlayerCard ? 'player-card' : 'other-card'}`}
            {...attributes}
            {...listeners}
        >
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
    const [activeId, setActiveId] = useState(null);
    const [updating, setUpdating] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Build the ordered cards list
    useEffect(() => {
        const allCards = getAllCardsInOrder(allPlayers);
        setOrderedCards(allCards);
    }, [allPlayers]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = orderedCards.findIndex(c =>
            `${c.playerId}-${c.cardIndex}` === active.id
        );
        const newIndex = orderedCards.findIndex(c =>
            `${c.playerId}-${c.cardIndex}` === over.id
        );

        if (oldIndex === -1 || newIndex === -1) return;

        // Optimistically update UI
        const newOrderedCards = arrayMove(orderedCards, oldIndex, newIndex);

        // Update positions
        const updatedCards = newOrderedCards.map((card, index) => ({
            ...card,
            position: index
        }));

        setOrderedCards(updatedCards);

        // Update player's card positions in Firebase
        const movedCard = orderedCards[oldIndex];
        if (movedCard.playerId === playerId) {
            setUpdating(true);
            try {
                const roomData = { players: allPlayers };
                await updateCardPosition(
                    roomId,
                    playerId,
                    movedCard.cardIndex,
                    newIndex,
                    roomData
                );
            } catch (error) {
                console.error('Failed to update card position:', error);
                // Revert on error
                setOrderedCards(orderedCards);
            } finally {
                setUpdating(false);
            }
        }
    };

    const activeCard = activeId
        ? orderedCards.find(c => `${c.playerId}-${c.cardIndex}` === activeId)
        : null;

    return (
        <div className="card-ordering-interface">
            <h3>Card Order</h3>
            <p className="ordering-hint">
                Drag your cards to arrange them in the correct order
            </p>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={orderedCards.map(c => `${c.playerId}-${c.cardIndex}`)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="cards-order-list">
                        {orderedCards.map((card) => {
                            const cardId = `${card.playerId}-${card.cardIndex}`;
                            const isPlayerCard = card.playerId === playerId;

                            return (
                                <SortableCard
                                    key={cardId}
                                    id={cardId}
                                    card={card}
                                    isPlayerCard={isPlayerCard}
                                />
                            );
                        })}
                    </div>
                </SortableContext>

                <DragOverlay dropAnimation={null}>
                    {activeCard && (
                        <div className="sortable-card player-card dragging">
                            <div className="card-position">{activeCard.position + 1}</div>
                            <div className="card-info">
                                <div className="card-label">Your Card</div>
                                <div className="card-number-large">{activeCard.cardNumber}</div>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>

            {updating && (
                <div className="updating-indicator">
                    <div className="spinner-small"></div>
                    Updating...
                </div>
            )}
        </div>
    );
}
