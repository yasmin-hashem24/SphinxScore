import React, { useState } from 'react';
import axios from "axios";
function Home() {
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const getResponse = await axios.get("https://localhost:44345/api/user/users");
                console.log(getResponse.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);
    // Syntax: useState(initialValue)
    const [count, setCount] = useState(0); // Initializing state variable 'count' with initial value 0

    const increment = () => {
        setCount(count + 1); // Updating 'count' using the setCount function
    };

    const decrement = () => {
        setCount(count - 1); // Updating 'count' using the setCount function
    };
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    );
}
export default Home;