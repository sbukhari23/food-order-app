import { useState, useEffect } from 'react';

export default function Meals() {

    const [loadedMeals, setLoadedMeals] = useState([]);

    useEffect(() => {
        async function fetchMeals() {

            // try {
            const response = await fetch('http://localhost:3000/meals');

            // }

            if (!response.ok) {
                throw new Error('Failed to fetch meals');
            }

            const meals = await response.json();
            setLoadedMeals(meals);
        }

        fetchMeals();
    }, []);


    return (
        <ul id="meals">
            {loadedMeals.map((meal) => (
                <li key={meal.id}>
                    <h3>{meal.name}</h3>
                </li>
            ))}
        </ul>
    );
}