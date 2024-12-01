<?php
include 'connection.php';
// Fetch events

$data = json_decode(file_get_contents("php://input"), true);

// Prepare the SQL query
$sql = "SELECT * FROM tbl_users ";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

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
