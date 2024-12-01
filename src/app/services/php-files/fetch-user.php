<?php
include 'connection.php';
// Fetch events

$data = json_decode(file_get_contents("php://input"), true);
$tokenId = $data['tokenId'] ?? '28d7859-29b4-414c-9fe1-7ec187f92e92';

// Prepare the SQL query
$sql = "SELECT * FROM tbl_users WHERE tokenId = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tokenId); // Use "s" if tokenId is a string; change to "i" if it's an integer
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
