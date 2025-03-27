import React, { useState, useEffect } from 'react';
import './index.css';
import  Spinner  from './Spinner';
function StudentJudgedCount(props) {
    const [judgedData, setJudgedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state

    const fetchData = () => {
        setIsLoading(true); // Set isLoading to true when fetching data
        fetch(`${props.baseUrl}/home/show-judge-count/`)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.judged_count_round_1 - b.judged_count_round_1);
                setJudgedData(sortedData);
                setIsLoading(false); // Set isLoading to false when data is fetched
                console.log(data);
            })
            .catch(error => {
                setIsLoading(false); // Set isLoading to false on error as well
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchData()
        const interval = setInterval(() => fetchData(), 10000); // Fetch data every 10 seconds

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    return (
        <>
            {isLoading ? ( // Conditionally render spinner if isLoading is true
<Spinner/>
            ) : (
                <div className="p-6">
                    <div className="text-center">
                        <p style={{ fontWeight: 'bold' }}>Note : Real-time updates are shown.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            judgedData.map(item => (
                                <div key={item.id} className="bg-white rounded-lg p-6 shadow-md">
                                    <h2 className="text-xl font-semibold mb-2">{item.poster_title}</h2>
                                    <p className="text-gray-600 mb-4"><b>Poster ID:</b> {item.poster_ID}</p>
                                    <p className="text-gray-600 mb-4"><b>Name:</b> {item.first_name} {item.last_name}</p>
                                    <p className="text-gray-600 mb-4"><b>Email:</b> {item.email}</p>
                                    <p className="text-gray-600 mb-4"><b>Department:</b> {item.department}, <b>Academic Status:</b> {item.academic_status}</p>
                                    <p className="text-gray-600 mb-4"><b>Total Judged Count:</b> {item.judged_count_round_1 ? item.judged_count_round_1 : '0'}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </>
    );
}

export default StudentJudgedCount;
