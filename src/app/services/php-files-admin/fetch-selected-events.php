<?php
include 'connection.php';

// Set the content type to JSON
header('Content-Type: application/json');

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Extract event ID from input, default to '1' if not provided
$eventId = $data['eventId'] ?? null;

try {
    // Prepare the SQL query
    $sql = $conn->prepare("SELECT status, event_name, event_start, event_end, details, event_image, date_created 
                           FROM tbl_event 
                           WHERE event_id = ?");
    $sql->bind_param("s", $eventId);
    $sql->execute();

    // Get the result set
    $result = $sql->get_result();

    if ($result->num_rows > 0) {
        // Fetch the event data
        $event = $result->fetch_assoc();

        // Return success response
        echo json_encode([
            'success' => true,
            'endDate' => $event['event_end'],
            'message' => 'Transaction updated and notification added successfully!'
        ]);
    } else {
        // Return failure response
        echo json_encode([
            'success' => false,
            'message' => 'Event not found!'
        ]);
    }
} catch (Exception $e) {
    // Handle exceptions
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred!',
        'error' => $e->getMessage()
    ]);
} finally {
    // Close the connection
    $conn->close();
}
?>
s