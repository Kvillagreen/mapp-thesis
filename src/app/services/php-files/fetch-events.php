<?php
include 'connection.php';
// Fetch events
$sql = "SELECT event_id, event_name, event_start, event_end, details, event_image, status, date_created FROM tbl_event WHERE status = '1' AND event_end > NOW()";
$result = $conn->query($sql);

$events = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($events);

$conn->close();
?>
