<?php
$servername = "localhost";
$username = "robo_user";
$password = "password";
$dbname = "robo_comando";

$initialStats = [
    'stamina' => 100, // Substitua pelo valor inicial desejado
    'habilidade' => 100, // Substitua pelo valor inicial desejado
    'sorte' => 100 // Substitua pelo valor inicial desejado
];

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Checa a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Retornar os pontos de vida e energia
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get_stats'])) {
    $result = $conn->query("SELECT life_points, energy_points FROM player_stats WHERE id = 1");
    echo json_encode($result->fetch_assoc());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['stat_name'])) {
    $statName = $conn->real_escape_string($_POST['stat_name']);
    $action = $conn->real_escape_string($_POST['action']);
    $currentValue = (int)$_POST['current_value'];

    if ($action === 'increment') {
        $currentValue += 1;
    } else if ($action === 'decrement') {
        $currentValue -= 1;
    }

    echo json_encode(['new_value' => $currentValue]);
    exit;
}

// Adicionar uma nova anotação
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['note_content'])) {
    $content = $conn->real_escape_string($_POST['note_content']);
    $conn->query("INSERT INTO notes (content) VALUES ('$content')");
    echo json_encode(['success' => true]);
    exit;
}

// Obter todas as anotações
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get_notes'])) {
    $result = $conn->query("SELECT id, content FROM notes ORDER BY created_at DESC");
    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    echo json_encode($notes);
    exit;
}

// Remover uma anotação
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_note'])) {
    $id = (int)$_POST['delete_note'];
    $conn->query("DELETE FROM notes WHERE id = $id");
    echo json_encode(['success' => true]);
    exit;
}

// Atualizar a função para buscar os valores iniciais dos status
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get_initial_stats'])) {
    echo json_encode($initialStats);
    exit;
}

// Salvar ou atualizar informações do robô
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['robot_name'])) {
    $name = $conn->real_escape_string($_POST['robot_name']);
    $armor = (int)$_POST['robot_armor'];
    $speed = $conn->real_escape_string($_POST['robot_speed']);
    $combat = (int)$_POST['robot_combat'];
    $bonus = (int)$_POST['robot_bonus'] ? (int)$_POST['robot_bonus'] : 0;
    $specialty = $conn->real_escape_string($_POST['robot_specialty']) ? $conn->real_escape_string($_POST['robot_specialty']) : '';
    
    // Verificar se já existe um robô registrado
    $result = $conn->query("SELECT id FROM robot LIMIT 1");
    if ($result->num_rows > 0) {
        // Atualizar robô existente
        $conn->query("UPDATE robot SET 
            name='$name', 
            armor=$armor, 
            speed='$speed', 
            combat=$combat, 
            bonus=$bonus, 
            specialty='$specialty'
        ");
    } else {
        // Inserir novo robô
        $conn->query("INSERT INTO robot (name, armor, speed, combat, bonus, specialty) VALUES 
            ('$name', $armor, '$speed', $combat, $bonus, '$specialty')
        ");
    }
    echo json_encode(['success' => true]);
    exit;
}

// Obter informações do robô
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get_robot'])) {
    $result = $conn->query("SELECT * FROM robot LIMIT 1");
    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode([]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $stmt = $conn->prepare('INSERT INTO inventory (name, quantity) VALUES (?, 1)');
    $stmt->bind_param('s', $name);
    $stmt->execute();
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = $_DELETE['id'];
    $stmt = $conn->prepare('DELETE FROM inventory WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'];
    $action = $_PUT['action'];

    if ($action === 'increment') {
        $stmt = $conn->prepare('UPDATE inventory SET quantity = quantity + 1 WHERE id = ?');
    } elseif ($action === 'decrement') {
        $stmt = $conn->prepare('UPDATE inventory SET quantity = quantity - 1 WHERE id = ? AND quantity > 1');
    }

    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query('SELECT * FROM inventory');
    $inventory = [];
    while ($row = $result->fetch_assoc()) {
        $inventory[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($inventory);
}

$conn->close();
?>
