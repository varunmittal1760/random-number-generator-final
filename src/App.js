import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [randomNumber, setRandomNumber] = useState(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/randomnumberhub")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveRandomNumber", (number) => {
      setRandomNumber(number);
    });

    async function startConnection() {
      try {
        await connection.start();
        console.log("SignalR Connected.");

        connection.invoke("GenerateRandomNumber")
          .catch((error) => console.error(error));
      } catch (err) {
        console.log(err);
      }
    }

    startConnection();

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="App">
      <h1>Random Number: {randomNumber}</h1>
    </div>
  );
}

export default App;
