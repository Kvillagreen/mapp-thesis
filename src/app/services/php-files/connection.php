<?php 


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost"; // Adjust if hosted remotely
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "chmsu-a_mapp"; // Replace with your database name


$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit();
}
 
?>