<?php
/**
 * FileConvert - api_db.php
 * Ponte para o banco de dados SQLite local
 */

$db_file = 'dados.db';

try {
    $db = new PDO("sqlite:$db_file");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Criar tabela de histórico se não existir
    $db->exec("CREATE TABLE IF NOT EXISTS historico (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        arquivo_nome TEXT,
        tipo_de TEXT,
        tipo_para TEXT,
        tamanho INTEGER,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

} catch (PDOException $e) {
    die("Erro ao conectar com o banco de dados: " . $e->getMessage());
}

// Handlers de API (via POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'add_history') {
        $stmt = $db->prepare("INSERT INTO historico (arquivo_nome, tipo_de, tipo_para, tamanho) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $_POST['nome'],
            $_POST['de'],
            $_POST['para'],
            $_POST['tamanho']
        ]);
        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($action === 'get_history') {
        $stmt = $db->query("SELECT * FROM historico ORDER BY data_criacao DESC LIMIT 10");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }
}
