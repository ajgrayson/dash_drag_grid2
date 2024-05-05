import { useEffect, useCallback } from 'react';

/**
 * Custom hook to establish communication between windows or components using postMessage.
 *
 * @param {string} channel - The channel identifier to filter messages.
 * @param {function} onMessage - Callback to handle incoming messages.
 * @param {string} targetOrigin - Specifies the origin of the target window to which messages are sent.
 * @returns {function} A function to send messages to the target origin.
 */
function useComms(channel, onMessage, dataType = 'json', targetOrigin = '*') {
    // Handler for incoming messages
    const handleMessage = useCallback((event) => {
        // Security check: validate the origin of the message
        if (targetOrigin !== '*' && event.origin !== targetOrigin) {
            console.warn('Received message from unauthorized origin:', event.origin);
            return;
        }

        // Check if the message is intended for this channel
        if (event && event.data && event.data.channel === channel) {
            console.log('message recieved', event.data.message)
            let msg = event.data.message;
            if (dataType == 'json') {
                msg = JSON.parse(event.data.message);
            }
            onMessage(msg);
        }
    }, [channel, onMessage, targetOrigin]);

    // Effect to set up and tear down the message listener
    useEffect(() => {
        window.addEventListener('message', handleMessage);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [handleMessage]);

    // Function to send messages
    const sendMessage = useCallback((message) => {
        console.log('message sent', msg)
        let msg = message;
        if (dataType == 'json') {
            msg = JSON.stringify(message);
        }
        window.postMessage({ channel, message: msg }, targetOrigin);
    }, [channel, targetOrigin]);

    return sendMessage;
}

export default useComms;