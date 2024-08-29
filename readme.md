### Aplicativo de Acompanhamento para o livro jogo Robô Comando
* Criado usando NGinx e MariaDB
* Feito como estudo de javascript, sql e php

### Configuração do Banco de Dados (MariaDB)
* Criar Banco
```sql
CREATE DATABASE IF NOT EXISTS robo_comando;
USE robo_comando;
```

* Criar tabela de Inventário
```sql
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 1
);
```

* Criar tabela de Status de Jogador
```sql
CREATE TABLE IF NOT EXISTS player_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    life INT DEFAULT 100,
    energy INT DEFAULT 100,
    stamina INT DEFAULT 10,
    skill INT DEFAULT 10,
    luck INT DEFAULT 10
);
```

* Criar tabela de Dados de Robôs
```sql
CREATE TABLE IF NOT EXISTS robots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    armour INT DEFAULT 0,
    speed ENUM('lento', 'médio', 'rápido', 'muito rápido') DEFAULT 'médio',
    combat INT DEFAULT 0,
    bonus TEXT
);
```

* Criar tabela de Inimigos no Compate a Pé
```sql
CREATE TABLE IF NOT EXISTS foot_combat_enemies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    skill INT DEFAULT 0,
    stamina INT DEFAULT 0
);
```

* Criar tabela de Inimigos no Combate com Robôs
```sql
CREATE TABLE IF NOT EXISTS robot_combat_enemies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    armour INT DEFAULT 0,
    speed ENUM('lento', 'médio', 'rápido', 'muito rápido') DEFAULT 'médio',
    combat INT DEFAULT 0,
    bonus TEXT
);
```