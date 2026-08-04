-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 16/01/2026 às 22:09
-- Versão do servidor: 8.3.0
-- Versão do PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `gestao_danca`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `alunos`
--

DROP TABLE IF EXISTS `alunos`;
CREATE TABLE IF NOT EXISTS `alunos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `dataNascimento` date DEFAULT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `endereco` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `escolaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_alunos_escola` (`escolaId`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `alunos`
--

INSERT INTO `alunos` (`id`, `nome`, `dataNascimento`, `cpf`, `email`, `telefone`, `endereco`, `createdAt`, `updatedAt`, `escolaId`) VALUES
(10, 'João da Silva - Atualizado', '2012-01-20', '11122233345', 'joao.silva@escolateste.com', '48984655224', 'Servidão Alzira Ventura Vieira, 22, Capoeiras, Florianópolis - SC, CEP: 88090175', '2025-09-24 09:45:45', '2025-10-08 23:01:37', 5),
(12, 'Carla Mendes', '2011-09-10', '55566677788', 'carla.mendes@escolateste.com', '11977776666', NULL, '2025-09-25 07:22:44', '2025-09-25 07:22:44', 5),
(13, 'Pedro Martins', '2015-02-18', '33344455566', 'novo.aluno@email.com', '48984655211', 'Servidão Alzira Ventura Vieira, 22, Capoeiras, Florianópolis - SC, CEP: 88090175', '2025-09-25 08:32:08', '2025-10-08 23:02:04', 5),
(15, 'Carlos Pereira', NULL, '98765432101', 'carlos.pereira@email.com', '(11) 97777-5555', 'Rua Atualizada, 250', '2025-09-29 08:54:17', '2025-09-29 08:56:29', 5),
(16, 'Ana Souza', NULL, '98765432102', 'ana.souza@email.com', '(11) 97777-7777', 'Rua Atualizada, 350', '2025-09-29 09:06:40', '2025-09-29 09:07:48', 5),
(18, 'Marcos mar', '1989-02-10', '8549658741', 'nal@gmail.com', '48984655228', NULL, '2025-10-08 22:34:42', '2025-10-08 22:34:42', NULL),
(19, 'miro fa', '1987-12-20', '8549658747', 'miro@gmail.com', '48984655228', NULL, '2025-10-08 22:42:07', '2025-10-08 22:42:07', NULL),
(20, 'valeria ferreira', '2014-10-20', '8549658722', 'valeria@gmail.com', '48984655227', NULL, '2025-10-08 23:01:09', '2025-10-08 23:01:09', NULL),
(26, 'val ff', '1988-01-10', '8549658740', 'kal@gmail.com', '48984655221', NULL, '2025-10-23 07:46:59', '2025-10-23 07:46:59', NULL),
(27, 'Joana Ferreira', '1988-10-10', '85445874000', 'joana@gmail.com', '41984156321', NULL, '2025-10-29 13:49:15', '2025-10-29 13:49:15', NULL),
(28, 'Timote', '1988-10-10', '854458745100', 'timote@gmail.com', '41984156100', NULL, '2025-10-29 14:12:31', '2025-10-29 14:12:31', NULL),
(29, 'Kiru Costa', '1888-10-10', '15445874541', 'kiru@gmail.com', '47984156325', NULL, '2025-10-29 14:22:30', '2025-10-29 14:22:30', NULL),
(30, 'Marico per', '1999-10-10', '80445874541', 'marico@gmail.com', '11984156321', NULL, '2025-10-29 15:37:42', '2025-10-29 15:37:42', NULL),
(33, 'dia', '1984-10-10', '85445874542', 'dia@gmail.com', '41984156325', NULL, '2026-01-14 17:22:23', '2026-01-14 17:22:23', NULL),
(37, 'mafi', '1987-01-10', '85445874540', 'mafi@gmail.com', '11984156321', 'Servidão Alzira Ventura Vieira, 20, Capoeiras, Florianópolis - SC, CEP: 88090175', '2026-01-15 08:08:09', '2026-01-15 08:08:09', 29),
(38, 'João Roberto', '2010-10-10', '82010214114', 'joaoroberto@gmail.com', '48985855415', 'Servidão Alzira Ventura Vieira, 00, Capoeiras, Florianópolis - SC, CEP: 88090175', '2026-01-15 20:23:23', '2026-01-15 20:23:23', 30);

-- --------------------------------------------------------

--
-- Estrutura para tabela `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL COMMENT 'Usuário que executou a ação',
  `escolaId` int DEFAULT NULL COMMENT 'Escola afetada (se houver)',
  `contractId` int DEFAULT NULL COMMENT 'Contrato afetado (se houver)',
  `action` varchar(100) NOT NULL COMMENT 'Nome da ação executada',
  `entity` varchar(100) NOT NULL COMMENT 'Entidade afetada (contract, split, isencao, billing)',
  `entityId` int DEFAULT NULL COMMENT 'ID da entidade afetada',
  `payload` json DEFAULT NULL COMMENT 'Snapshot dos dados no momento da ação',
  `ip` varchar(45) DEFAULT NULL COMMENT 'IP do executor',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Acionadores `audit_logs`
--
DROP TRIGGER IF EXISTS `prevent_audit_delete`;
DELIMITER $$
CREATE TRIGGER `prevent_audit_delete` BEFORE DELETE ON `audit_logs` FOR EACH ROW SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'audit_logs is immutable'
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `prevent_audit_update`;
DELIMITER $$
CREATE TRIGGER `prevent_audit_update` BEFORE UPDATE ON `audit_logs` FOR EACH ROW SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'audit_logs is immutable'
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `billing_cycles`
--

DROP TABLE IF EXISTS `billing_cycles`;
CREATE TABLE IF NOT EXISTS `billing_cycles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `escolaId` int NOT NULL,
  `contractId` int NOT NULL,
  `inicio` date NOT NULL,
  `fim` date NOT NULL,
  `totalBruto` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Total movimentado no período',
  `totalTaxa` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Total da taxa calculada',
  `totalLiquido` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT 'Total após aplicação da taxa',
  `status` enum('OPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_billing_cycles_escola` (`escolaId`),
  KEY `fk_billing_cycles_contract` (`contractId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `comissaos`
--

DROP TABLE IF EXISTS `comissaos`;
CREATE TABLE IF NOT EXISTS `comissaos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pagamentoId` int NOT NULL,
  `professorId` int DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `comissaos`
--

INSERT INTO `comissaos` (`id`, `pagamentoId`, `professorId`, `valor`, `createdAt`, `updatedAt`) VALUES
(6, 120, 9, 90.00, '2025-09-29 08:32:59', '2025-10-26 13:05:56'),
(7, 6, 4, 55.00, '2025-10-26 12:13:56', '2025-10-26 12:13:56'),
(8, 155, 17, 93.00, '2026-01-15 09:45:19', '2026-01-15 09:45:19');

-- --------------------------------------------------------

--
-- Estrutura para tabela `contracts`
--

DROP TABLE IF EXISTS `contracts`;
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `escolaId` int NOT NULL,
  `status` enum('TRIAL','ACTIVE','SUSPENDED') NOT NULL DEFAULT 'TRIAL',
  `modo` enum('TEST','PROD') NOT NULL DEFAULT 'TEST',
  `taxaPercentual` decimal(5,2) NOT NULL DEFAULT '1.30' COMMENT 'Percentual de taxa aplicado após o trial',
  `trialEndsAt` datetime DEFAULT NULL COMMENT 'Data final do período de trial',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_contracts_escola` (`escolaId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `escolas`
--

DROP TABLE IF EXISTS `escolas`;
CREATE TABLE IF NOT EXISTS `escolas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `isencaoAtiva` tinyint(1) DEFAULT '0',
  `logoUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `escolas`
--

INSERT INTO `escolas` (`id`, `nome`, `isencaoAtiva`, `logoUrl`, `createdAt`, `updatedAt`) VALUES
(3, 'Escola de Dança Vida', 0, NULL, '2025-09-23 06:59:54', '2025-09-23 06:59:54'),
(4, 'Escola de Dança São Paulo', 0, NULL, '2025-09-23 07:06:42', '2025-09-23 07:06:42'),
(5, 'Escola de Dança Central', 0, '/uploads/logos/5-1761505510607.jpg', '2025-09-23 07:15:20', '2025-10-26 16:05:10'),
(7, 'Escola de Dança Teste', 0, NULL, '2026-01-13 08:23:21', '2026-01-13 08:23:21'),
(8, 'Escola de Dança Ativação', 0, NULL, '2026-01-13 08:34:42', '2026-01-13 08:34:42'),
(9, 'teste', 0, NULL, '2026-01-13 09:51:06', '2026-01-13 09:51:06'),
(10, 'Escola de Dança Teste SaaS', 0, NULL, '2026-01-13 11:45:12', '2026-01-13 11:45:12'),
(11, 'Escola Frontend Teste', 0, NULL, '2026-01-13 12:06:40', '2026-01-13 12:06:40'),
(12, 'Escola dança teste', 0, NULL, '2026-01-13 13:15:46', '2026-01-13 13:15:46'),
(13, 'Escola dançando livre', 0, NULL, '2026-01-13 13:20:35', '2026-01-13 13:20:35'),
(14, 'Escola dancante', 0, NULL, '2026-01-13 15:15:40', '2026-01-13 15:15:40'),
(15, 'danceteria', 0, NULL, '2026-01-13 15:18:25', '2026-01-13 15:18:25'),
(16, 'ESCOLA DO DERALDO', 0, NULL, '2026-01-13 17:53:02', '2026-01-13 17:53:02'),
(17, 'maria escola', 0, NULL, '2026-01-13 17:59:46', '2026-01-13 17:59:46'),
(18, 'ESCOLA DANÇA MARIO', 0, NULL, '2026-01-13 19:51:21', '2026-01-13 19:51:21'),
(25, 'Escola Teste', 0, NULL, '2026-01-14 12:01:07', '2026-01-14 12:01:07'),
(26, 'DINOCODANÇA', 0, NULL, '2026-01-14 12:43:19', '2026-01-14 12:43:19'),
(27, 'DINOKI', 0, NULL, '2026-01-14 14:23:20', '2026-01-14 14:23:20'),
(28, 'marcosdança', 0, NULL, '2026-01-14 14:50:27', '2026-01-14 14:50:27'),
(29, '85474578741', 0, NULL, '2026-01-14 17:18:59', '2026-01-14 17:18:59'),
(30, 'DANÇA DO RICARDO ', 0, NULL, '2026-01-15 20:19:32', '2026-01-15 20:19:32'),
(31, 'ESCOLA  DE DANÇA CUMUNITARIA', 0, NULL, '2026-01-16 08:40:34', '2026-01-16 08:40:34');

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
CREATE TABLE IF NOT EXISTS `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nomeCompleto` varchar(255) NOT NULL,
  `nomeSocial` varchar(255) DEFAULT NULL,
  `nomeMae` varchar(255) DEFAULT NULL,
  `dataNascimento` date DEFAULT NULL,
  `nacionalidade` varchar(100) DEFAULT NULL,
  `naturalidade` varchar(100) DEFAULT NULL,
  `estadoCivil` varchar(50) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `cpf` varchar(20) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `rua` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `salario` decimal(10,2) DEFAULT NULL,
  `dataAdmissao` date DEFAULT NULL,
  `escolaId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `endereco` text,
  `departamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `funcionarios`
--

INSERT INTO `funcionarios` (`id`, `nomeCompleto`, `nomeSocial`, `nomeMae`, `dataNascimento`, `nacionalidade`, `naturalidade`, `estadoCivil`, `genero`, `cpf`, `rg`, `telefone`, `email`, `cep`, `rua`, `numero`, `bairro`, `cidade`, `estado`, `cargo`, `salario`, `dataAdmissao`, `escolaId`, `createdAt`, `updatedAt`, `endereco`, `departamento`) VALUES
(1, 'Ana Souza Atualizada', 'Ana S.', NULL, '1988-10-10', 'Brasileiro', 'Florianopolis', 'Casado(a)', 'Feminino', '8549658700', '8192114', '41984156325', 'vad@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'analista', 2222.00, '2025-10-10', 5, '2025-09-23 08:27:09', '2025-10-13 09:48:48', 'Servidão Alzira Ventura Vieira, 100, Capoeiras, Florianópolis - SC, CEP: 88090175', NULL),
(2, 'João Pereira Atualizado', '', NULL, '1999-10-20', 'Brasileiro', 'Florianopolis', 'Casado(a)', 'Masculino', '85445874588', '85485447815', '41984156320', 'joao@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'telefonista', 1.85, '2025-04-10', 5, '2025-09-23 09:47:02', '2025-10-13 09:50:47', 'Servidão Alzira Ventura Vieira, 41, Capoeiras, Florianópolis - SC, CEP: 88090175', NULL),
(3, 'Ana Paula', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2025-09-25 07:31:32', '2025-09-25 07:31:32', NULL, NULL),
(4, 'Ana Paula', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, '2025-09-25 08:28:14', '2025-09-25 08:28:14', NULL, NULL),
(16, 'Ferreira Neto', '', NULL, '1974-12-01', 'Brasileiro', 'Florianopolis', 'Casado(a)', 'Masculino', '85445874111', '8192114', '11984156321', 'ferreira@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'Analista', 2000.00, '2025-01-20', 5, '2025-12-11 16:30:51', '2025-12-11 16:35:39', 'Servidão Alzira Ventura Vieira, 20, Capoeiras, Florianópolis - SC, CEP: 88090175', NULL),
(17, 'Ferreira Neto', '', NULL, '1974-12-01', 'Brasileiro', 'Florianopolis', 'Casado(a)', 'Masculino', '85445874111', '8192114', '11984156321', 'ferreira@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'Analista', 3.00, '2025-01-20', 5, '2025-12-11 16:31:27', '2025-12-11 16:31:27', 'Servidão Alzira Ventura Vieira, 20, Capoeiras, Florianópolis - SC, CEP: 88090175', NULL),
(19, 'Marcos Frieira', 'VALDEMIR FERNANDES MARQUES', NULL, '1985-01-10', 'Brasileiro', 'Florianopolis', 'Solteiro(a)', 'Masculino', '85445874000', '8192111', '41984156300', 'marcosfrieira@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'Analista', 2.00, '2026-01-15', 29, '2026-01-15 09:10:14', '2026-01-15 09:10:14', 'Servidão Alzira Ventura Vieira, 01, Capoeiras, Florianópolis - SC, CEP: 88090175', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `isencoes_taxa`
--

DROP TABLE IF EXISTS `isencoes_taxa`;
CREATE TABLE IF NOT EXISTS `isencoes_taxa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `escolaId` int DEFAULT NULL,
  `contratoId` int NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `criadoPor` int NOT NULL,
  `dataInicio` datetime NOT NULL,
  `dataFim` datetime NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `tipoTaxa` enum('PLATAFORMA') NOT NULL DEFAULT 'PLATAFORMA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `isencoes_taxa`
--

INSERT INTO `isencoes_taxa` (`id`, `escolaId`, `contratoId`, `motivo`, `criadoPor`, `dataInicio`, `dataFim`, `ativo`, `createdAt`, `updatedAt`, `tipoTaxa`) VALUES
(1, 5, 0, 'Prorrogação da isenção', 0, '2025-09-22 21:00:00', '2025-10-04 21:00:00', 1, '2025-09-23 10:34:57', '2026-01-15 17:17:49', 'PLATAFORMA'),
(2, 3, 0, 'lpara outro ano', 1, '2025-12-10 00:00:00', '2026-12-09 00:00:00', 0, '2026-01-09 08:43:51', '2026-01-12 19:53:25', 'PLATAFORMA'),
(3, NULL, 0, 'aguardando revisão', 1, '2022-10-10 00:00:00', '2029-10-10 00:00:00', 0, '2026-01-09 09:03:11', '2026-01-12 19:53:25', 'PLATAFORMA'),
(4, NULL, 0, 'teste', 1, '2025-10-10 00:00:00', '2026-01-12 00:00:00', 0, '2026-01-12 08:30:51', '2026-01-12 19:53:24', 'PLATAFORMA'),
(5, 3, 0, 'teste', 1, '2025-10-10 00:00:00', '2026-01-12 00:00:00', 0, '2026-01-12 14:52:15', '2026-01-12 19:53:23', 'PLATAFORMA'),
(6, 3, 0, 'teste', 1, '2025-10-10 00:00:00', '2026-01-12 00:00:00', 1, '2026-01-12 17:55:14', '2026-01-12 19:53:21', 'PLATAFORMA');

-- --------------------------------------------------------

--
-- Estrutura para tabela `lancamentos_financeiros`
--

DROP TABLE IF EXISTS `lancamentos_financeiros`;
CREATE TABLE IF NOT EXISTS `lancamentos_financeiros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('ENTRADA','SAIDA') NOT NULL,
  `origem` varchar(50) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data` date NOT NULL,
  `escolaId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `lancamentos_financeiros`
--

INSERT INTO `lancamentos_financeiros` (`id`, `tipo`, `origem`, `descricao`, `valor`, `data`, `escolaId`, `createdAt`, `updatedAt`) VALUES
(1, 'ENTRADA', 'MENSALIDADE', 'Pagamento da mensalidade #25', 95.00, '2025-01-10', 5, '2025-12-29 20:55:09', '2025-12-29 20:55:09'),
(2, 'ENTRADA', 'MENSALIDADE', 'Pagamento da mensalidade #22', 185.99, '2025-12-29', 5, '2025-12-29 21:08:25', '2025-12-29 21:08:25'),
(3, 'ENTRADA', 'VENDA', 'Venda #43', 7.50, '2026-01-02', 5, '2026-01-02 15:13:33', '2026-01-02 15:13:33'),
(4, 'ENTRADA', 'VENDA', 'Venda #44', 10.50, '2026-01-02', 5, '2026-01-02 15:14:46', '2026-01-02 15:14:46'),
(5, 'ENTRADA', 'VENDA', 'Venda #45', 3.00, '2026-01-02', 5, '2026-01-02 15:22:46', '2026-01-02 15:22:46'),
(6, 'ENTRADA', 'VENDA', 'Venda #46', 3.00, '2026-01-02', 5, '2026-01-02 15:28:16', '2026-01-02 15:28:16'),
(7, 'ENTRADA', 'VENDA', 'Venda #47', 3.00, '2026-01-02', 5, '2026-01-02 15:28:20', '2026-01-02 15:28:20'),
(8, 'ENTRADA', 'VENDA', 'Venda #48', 3.00, '2026-01-02', 5, '2026-01-02 15:35:35', '2026-01-02 15:35:35'),
(9, 'ENTRADA', 'VENDA', 'Venda #49', 3.00, '2026-01-02', 5, '2026-01-02 15:35:40', '2026-01-02 15:35:40'),
(10, 'ENTRADA', 'VENDA', 'Venda #50', 3.00, '2026-01-02', 5, '2026-01-02 15:37:10', '2026-01-02 15:37:10'),
(11, 'ENTRADA', 'VENDA', 'Venda #62', 35.00, '2026-01-14', 29, '2026-01-14 19:18:40', '2026-01-14 19:18:40'),
(12, 'ENTRADA', 'VENDA', 'Venda #63', 35.00, '2026-01-14', 29, '2026-01-14 19:29:22', '2026-01-14 19:29:22'),
(13, 'ENTRADA', 'MENSALIDADE', 'Pagamento da mensalidade #40', 95.00, '2026-01-15', 29, '2026-01-15 11:36:37', '2026-01-15 11:36:37'),
(14, 'ENTRADA', 'VENDA', 'Venda #64', 3.50, '2026-01-15', 29, '2026-01-15 11:44:11', '2026-01-15 11:44:11'),
(15, 'ENTRADA', 'VENDA', 'Venda #65', 3.50, '2026-01-15', 29, '2026-01-15 14:52:44', '2026-01-15 14:52:44'),
(16, 'ENTRADA', 'VENDA', 'Venda #66', 3.50, '2026-01-15', 29, '2026-01-15 14:53:03', '2026-01-15 14:53:03'),
(17, 'ENTRADA', 'VENDA', 'Venda #67', 3.00, '2026-01-15', 29, '2026-01-15 14:54:08', '2026-01-15 14:54:08'),
(18, 'ENTRADA', 'VENDA', 'Venda #68', 35.00, '2026-01-15', 29, '2026-01-15 14:54:43', '2026-01-15 14:54:43'),
(19, 'ENTRADA', 'VENDA', 'Venda #69', 8.00, '2026-01-15', 5, '2026-01-15 14:55:43', '2026-01-15 14:55:43'),
(20, 'ENTRADA', 'VENDA', 'Venda #70', 4.50, '2026-01-15', 5, '2026-01-15 14:58:20', '2026-01-15 14:58:20'),
(21, 'ENTRADA', 'VENDA', 'Venda #71', 3.50, '2026-01-15', 5, '2026-01-15 15:02:30', '2026-01-15 15:02:30'),
(22, 'ENTRADA', 'VENDA', 'Venda #72', 3.00, '2026-01-15', 29, '2026-01-15 15:18:33', '2026-01-15 15:18:33'),
(23, 'ENTRADA', 'VENDA', 'Venda #73', 74.80, '2026-01-15', 5, '2026-01-15 15:19:17', '2026-01-15 15:19:17'),
(24, 'ENTRADA', 'VENDA', 'Venda #74', 3.50, '2026-01-15', 29, '2026-01-15 15:51:41', '2026-01-15 15:51:41'),
(25, 'ENTRADA', 'VENDA', 'Venda #75', 35.00, '2026-01-15', 29, '2026-01-15 17:19:21', '2026-01-15 17:19:21'),
(26, 'ENTRADA', 'VENDA', 'Venda #76', 3.00, '2026-01-15', 29, '2026-01-15 19:34:35', '2026-01-15 19:34:35'),
(27, 'ENTRADA', 'VENDA', 'Venda #77', 3.50, '2026-01-15', 5, '2026-01-15 19:55:55', '2026-01-15 19:55:55'),
(28, 'ENTRADA', 'VENDA', 'Venda #78', 5.00, '2026-01-15', 30, '2026-01-15 20:38:36', '2026-01-15 20:38:36'),
(29, 'ENTRADA', 'MENSALIDADE', 'Pagamento da mensalidade #41', 185.00, '2026-01-15', 30, '2026-01-15 20:44:28', '2026-01-15 20:44:28'),
(30, 'ENTRADA', 'VENDA', 'Venda #79', 5.00, '2026-01-15', 30, '2026-01-15 20:46:24', '2026-01-15 20:46:24'),
(31, 'ENTRADA', 'VENDA', 'Venda #80', 35.00, '2026-01-15', 30, '2026-01-15 20:46:45', '2026-01-15 20:46:45');

-- --------------------------------------------------------

--
-- Estrutura para tabela `matriculas`
--

DROP TABLE IF EXISTS `matriculas`;
CREATE TABLE IF NOT EXISTS `matriculas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dataMatricula` date NOT NULL,
  `status` enum('ATIVA','INATIVA','CONCLUIDA') NOT NULL DEFAULT 'ATIVA',
  `alunoId` int NOT NULL,
  `turmaId` int NOT NULL,
  `escolaId` int NOT NULL,
  `valorMensalidade` decimal(10,2) NOT NULL DEFAULT '0.00',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `matriculas`
--

INSERT INTO `matriculas` (`id`, `dataMatricula`, `status`, `alunoId`, `turmaId`, `escolaId`, `valorMensalidade`, `createdAt`, `updatedAt`) VALUES
(8, '2025-10-29', 'INATIVA', 6, 17, 5, 150.00, '2025-10-29 11:00:08', '2025-10-29 15:48:20'),
(9, '2025-10-29', 'ATIVA', 12, 11, 5, 60.00, '2025-10-29 11:27:50', '2025-10-29 11:27:50'),
(14, '2025-11-05', 'ATIVA', 1, 13, 5, 175.00, '2025-11-05 08:14:43', '2025-11-05 08:14:43'),
(18, '2025-11-05', 'ATIVA', 10, 13, 5, 0.00, '2025-11-05 11:00:48', '2025-11-05 11:00:48'),
(19, '2025-11-05', 'ATIVA', 13, 13, 5, 0.00, '2025-11-05 11:32:23', '2025-11-05 11:32:23'),
(20, '2025-11-05', 'ATIVA', 9, 11, 5, 0.00, '2025-11-05 11:59:21', '2025-11-05 11:59:21'),
(21, '2025-12-12', 'ATIVA', 15, 11, 5, 85.00, '2025-12-12 19:10:55', '2025-12-12 19:10:55'),
(22, '2025-12-12', 'ATIVA', 30, 17, 5, 150.00, '2025-12-12 19:11:48', '2025-12-12 19:11:48'),
(23, '2025-12-15', 'ATIVA', 10, 11, 5, 120.00, '2025-12-15 16:07:18', '2025-12-15 16:07:18'),
(24, '2026-01-15', 'ATIVA', 37, 18, 29, 0.00, '2026-01-15 09:41:17', '2026-01-15 09:41:17'),
(25, '2026-01-15', 'ATIVA', 38, 19, 30, 0.00, '2026-01-15 20:31:01', '2026-01-15 20:31:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensalidades`
--

DROP TABLE IF EXISTS `mensalidades`;
CREATE TABLE IF NOT EXISTS `mensalidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matriculaId` int NOT NULL,
  `escolaId` int NOT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT '0.00',
  `dataVencimento` date NOT NULL,
  `status` enum('PENDENTE','PAGO','ATRASADO','CANCELADO') NOT NULL DEFAULT 'PENDENTE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `mensalidades`
--

INSERT INTO `mensalidades` (`id`, `matriculaId`, `escolaId`, `valor`, `dataVencimento`, `status`, `createdAt`, `updatedAt`) VALUES
(20, 12, 5, 95.00, '2025-10-29', 'PAGO', '2025-10-29 16:19:41', '2025-12-17 16:20:14'),
(21, 13, 5, 95.00, '2025-10-29', 'PAGO', '2025-10-29 16:28:49', '2025-12-18 17:48:02'),
(22, 14, 5, 185.99, '2026-03-01', 'PAGO', '2025-11-05 08:14:43', '2025-12-29 21:08:25'),
(23, 15, 5, 95.00, '2025-11-05', 'PAGO', '2025-11-05 10:23:31', '2025-12-29 20:21:57'),
(25, 17, 5, 95.00, '2025-11-05', 'PAGO', '2025-11-05 10:28:26', '2025-12-29 20:55:09'),
(26, 18, 5, 95.00, '2025-11-05', 'PAGO', '2025-11-05 11:00:48', '2025-12-17 15:41:30'),
(28, 20, 5, 95.00, '2025-11-05', 'PAGO', '2025-11-05 11:59:21', '2025-12-17 16:14:50'),
(29, 18, 5, 95.00, '2025-12-28', 'PAGO', '2025-12-12 18:04:09', '2025-12-17 15:37:54'),
(30, 14, 5, 185.99, '2026-03-01', 'PAGO', '2025-12-12 18:04:39', '2025-12-18 17:52:13'),
(31, 14, 5, 185.99, '2026-03-01', 'PAGO', '2025-12-12 18:04:49', '2025-12-18 16:16:02'),
(32, 21, 5, 85.00, '2025-12-15', 'PAGO', '2025-12-12 19:10:55', '2025-12-15 18:47:24'),
(33, 22, 5, 150.00, '2025-12-26', 'PENDENTE', '2025-12-12 19:11:48', '2025-12-15 18:47:33'),
(34, 18, 5, 150.00, '2026-01-20', 'PAGO', '2025-12-15 15:10:28', '2025-12-15 15:13:24'),
(36, 9, 5, 60.00, '2025-12-30', 'PENDENTE', '2025-12-15 16:48:37', '2025-12-15 16:48:37'),
(37, 9, 5, 87.50, '2025-12-30', 'PENDENTE', '2025-12-15 17:06:17', '2025-12-15 17:06:17'),
(38, 14, 5, 150.00, '2025-12-15', 'PENDENTE', '2025-12-15 17:19:19', '2025-12-15 17:19:19'),
(39, 22, 5, 200.00, '2025-12-30', 'PENDENTE', '2025-12-15 18:43:09', '2025-12-15 18:43:09'),
(40, 24, 29, 95.00, '2026-01-15', 'PAGO', '2026-01-15 09:41:17', '2026-01-15 11:36:37'),
(41, 25, 30, 185.00, '2026-01-15', 'PAGO', '2026-01-15 20:31:01', '2026-01-15 20:44:28');

-- --------------------------------------------------------

--
-- Estrutura para tabela `modalidades`
--

DROP TABLE IF EXISTS `modalidades`;
CREATE TABLE IF NOT EXISTS `modalidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `precoAula` decimal(10,2) NOT NULL,
  `escolaId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `modalidades`
--

INSERT INTO `modalidades` (`id`, `nome`, `descricao`, `precoAula`, `escolaId`, `createdAt`, `updatedAt`) VALUES
(1, 'Ballet', 'Dança clássica', 85.00, NULL, '2025-09-18 10:13:08', '2025-09-24 10:10:17'),
(3, 'Jazz Avançado Atualizado', 'para todos', 95.00, 5, '2025-09-23 07:30:44', '2025-10-29 16:47:22'),
(4, 'Ballet Clássico', 'toda idade', 85.00, NULL, '2025-09-24 11:02:34', '2025-10-29 16:47:36'),
(5, 'Samba de Gafieira', 'Aula de samba de gafieira para iniciantes.', 95.50, 5, '2025-10-10 07:01:39', '2025-10-10 07:01:39'),
(6, 'Dança de Rua', 'Uma nova modalidade', 80.50, 5, '2025-10-10 07:03:37', '2025-10-10 07:04:24'),
(7, 'Ballet Clássico', 'Para Crianças e Adultos', 155.00, 29, '2026-01-15 09:24:41', '2026-01-15 09:24:41'),
(8, 'hip hop', 'para qualquer idade', 125.00, 29, '2026-01-15 09:25:28', '2026-01-15 09:25:28'),
(9, 'Ballet Classico', 'Ballet para riança e Adulto', 170.00, 30, '2026-01-15 20:25:55', '2026-01-15 20:25:55'),
(10, 'Hip Hop', 'Para toda idade', 185.00, 30, '2026-01-15 20:26:34', '2026-01-15 20:26:34');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamentos`
--

DROP TABLE IF EXISTS `pagamentos`;
CREATE TABLE IF NOT EXISTS `pagamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mensalidadeId` int DEFAULT NULL,
  `vendaId` int DEFAULT NULL,
  `escolaId` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `dataPagamento` datetime NOT NULL,
  `metodo` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `matriculaId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `pagamentos`
--

INSERT INTO `pagamentos` (`id`, `mensalidadeId`, `vendaId`, `escolaId`, `valor`, `dataPagamento`, `metodo`, `createdAt`, `updatedAt`, `matriculaId`) VALUES
(1, 6, NULL, 5, 100.00, '2025-09-23 09:31:10', 'DINHEIRO', '2025-09-23 09:31:10', '2025-09-23 09:31:10', NULL),
(2, NULL, NULL, 5, 17.50, '2025-09-23 12:09:47', 'Dinheiro', '2025-09-23 12:09:47', '2025-09-23 12:09:47', NULL),
(3, NULL, NULL, 5, 13.50, '2025-09-25 07:57:32', 'Dinheiro', '2025-09-25 07:57:32', '2025-09-25 07:57:32', NULL),
(4, NULL, NULL, 5, 3.00, '2025-10-21 08:37:17', 'Crédito', '2025-10-21 08:37:17', '2025-10-21 08:37:17', NULL),
(5, NULL, NULL, 5, 33.00, '2025-10-21 08:37:42', 'PIX', '2025-10-21 08:37:42', '2025-10-21 08:37:42', NULL),
(6, NULL, NULL, 5, 30.00, '2025-10-21 08:37:59', 'Débito', '2025-10-21 08:37:59', '2025-10-21 08:37:59', NULL),
(7, NULL, NULL, 5, 35.00, '2025-10-21 08:40:05', 'PIX', '2025-10-21 08:40:05', '2025-10-21 08:40:05', NULL),
(8, NULL, NULL, 5, 35.00, '2025-10-21 08:40:18', 'Crédito', '2025-10-21 08:40:18', '2025-10-21 08:40:18', NULL),
(9, NULL, NULL, 5, 3.00, '2025-10-21 08:50:56', 'PIX', '2025-10-21 08:50:56', '2025-10-21 08:50:56', NULL),
(10, NULL, NULL, 5, 3.00, '2025-10-21 08:56:46', 'Crédito', '2025-10-21 08:56:46', '2025-10-21 08:56:46', NULL),
(11, NULL, NULL, 5, 5.00, '2025-10-21 09:22:25', 'Débito', '2025-10-21 09:22:25', '2025-10-21 09:22:25', NULL),
(12, NULL, NULL, 5, 5.00, '2025-10-21 09:30:46', 'Débito', '2025-10-21 09:30:46', '2025-10-21 09:30:46', NULL),
(13, NULL, NULL, 5, 3.00, '2025-10-21 10:40:30', 'PIX', '2025-10-21 10:40:30', '2025-10-21 10:40:30', NULL),
(14, NULL, NULL, 5, 5.00, '2025-10-21 10:43:19', 'PIX', '2025-10-21 10:43:19', '2025-10-21 10:43:19', NULL),
(15, NULL, NULL, 5, 3.00, '2025-10-21 10:50:44', 'PIX', '2025-10-21 10:50:44', '2025-10-21 10:50:44', NULL),
(16, NULL, NULL, 5, 3.00, '2025-10-21 11:20:17', 'PIX', '2025-10-21 11:20:17', '2025-10-21 11:20:17', NULL),
(17, NULL, NULL, 5, 3.00, '2025-10-21 11:23:05', 'PIX', '2025-10-21 11:23:05', '2025-10-21 11:23:05', NULL),
(18, NULL, NULL, 5, 3.00, '2025-10-21 11:27:56', 'PIX', '2025-10-21 11:27:56', '2025-10-21 11:27:56', NULL),
(19, NULL, NULL, 5, 3.00, '2025-10-21 11:32:17', 'Crédito', '2025-10-21 11:32:17', '2025-10-21 11:32:17', NULL),
(20, NULL, NULL, 5, 3.00, '2025-10-21 11:33:52', 'PIX', '2025-10-21 11:33:52', '2025-10-21 11:33:52', NULL),
(21, NULL, NULL, 5, 3.00, '2025-10-21 11:47:08', 'Crédito', '2025-10-21 11:47:08', '2025-10-21 11:47:08', NULL),
(22, NULL, NULL, 5, 3.00, '2025-10-21 12:00:56', 'Crédito', '2025-10-21 12:00:56', '2025-10-21 12:00:56', NULL),
(23, NULL, NULL, 5, 35.00, '2025-10-23 08:42:23', 'Crédito', '2025-10-23 08:42:23', '2025-10-23 08:42:23', NULL),
(24, NULL, NULL, 5, 3.00, '2025-10-23 08:48:54', 'Crédito', '2025-10-23 08:48:54', '2025-10-23 08:48:54', NULL),
(25, NULL, NULL, 5, 3.00, '2025-10-23 08:52:04', 'PIX', '2025-10-23 08:52:04', '2025-10-23 08:52:04', NULL),
(26, NULL, 26, 5, 3.00, '2025-10-23 09:00:24', 'PIX', '2025-10-23 09:00:24', '2025-10-23 09:00:24', NULL),
(27, NULL, 27, 5, 3.00, '2025-10-23 09:12:49', 'PIX', '2025-10-23 09:12:49', '2025-10-23 09:12:49', NULL),
(28, NULL, NULL, 5, 3.00, '2025-10-23 09:45:26', 'PIX', '2025-10-23 09:45:26', '2025-10-23 09:45:26', NULL),
(29, NULL, 29, 5, 9.00, '2025-10-23 10:32:19', 'PIX', '2025-10-23 10:32:19', '2025-10-23 10:32:19', NULL),
(30, NULL, 30, 5, 3.00, '2025-10-23 10:40:37', 'Crédito', '2025-10-23 10:40:37', '2025-10-23 10:40:37', NULL),
(31, NULL, 31, 5, 3.00, '2025-10-23 10:49:50', 'PIX', '2025-10-23 10:49:50', '2025-10-23 10:49:50', NULL),
(32, NULL, 32, 5, 3.00, '2025-10-23 11:19:30', 'PIX', '2025-10-23 11:19:30', '2025-10-23 11:19:30', NULL),
(33, NULL, 33, 5, 35.00, '2025-10-23 11:21:13', 'Débito', '2025-10-23 11:21:13', '2025-10-23 11:21:13', NULL),
(34, NULL, 34, 5, 35.00, '2025-10-23 11:31:21', 'PIX', '2025-10-23 11:31:21', '2025-10-23 11:31:21', NULL),
(35, NULL, 35, 5, 35.00, '2025-10-23 22:19:08', 'PIX', '2025-10-23 22:19:08', '2025-10-23 22:19:08', NULL),
(36, NULL, 36, 5, 3.00, '2025-10-24 19:48:53', 'pix', '2025-10-24 19:48:53', '2025-10-24 19:48:53', NULL),
(37, NULL, 37, 5, 3.00, '2025-10-26 18:09:16', 'PIX', '2025-10-26 18:09:16', '2025-10-26 18:09:16', NULL),
(38, NULL, 38, 5, 47.00, '2025-10-26 18:11:57', 'PIX', '2025-10-26 18:11:57', '2025-10-26 18:11:57', NULL),
(39, NULL, 39, 5, 47.00, '2025-10-26 18:14:43', 'Crédito', '2025-10-26 18:14:43', '2025-10-26 18:14:43', NULL),
(56, 29, NULL, 5, 95.00, '2025-12-15 21:00:00', 'PIX', '2025-12-17 15:37:54', '2025-12-17 15:37:54', NULL),
(57, 26, NULL, 5, 95.00, '2025-12-16 21:00:00', 'DINHEIRO', '2025-12-17 15:41:30', '2025-12-17 15:41:30', NULL),
(58, 34, NULL, 5, 150.00, '2025-12-24 21:00:00', 'PIX', '2025-12-17 15:42:00', '2025-12-17 15:42:00', NULL),
(59, 28, NULL, 5, 95.00, '2025-12-16 21:00:00', 'PIX', '2025-12-17 16:14:50', '2025-12-17 16:14:50', NULL),
(60, 26, NULL, 5, 95.00, '2025-12-16 21:00:00', 'DINHEIRO', '2025-12-17 16:17:01', '2025-12-17 16:17:01', NULL),
(61, 20, NULL, 5, 95.00, '2025-12-17 21:00:00', 'PIX', '2025-12-17 16:20:14', '2025-12-17 16:20:14', NULL),
(62, 32, NULL, 5, 85.00, '2025-12-16 21:00:00', 'Crédito', '2025-12-17 16:21:18', '2025-12-17 16:21:18', NULL),
(63, 32, NULL, 5, 85.00, '2025-12-16 21:00:00', 'PIX', '2025-12-17 16:21:34', '2025-12-17 16:21:34', NULL),
(64, 34, NULL, 5, 150.00, '2025-12-16 21:00:00', 'Crédito', '2025-12-17 16:22:46', '2025-12-17 16:22:46', NULL),
(65, 34, NULL, 5, 150.00, '2025-12-16 21:00:00', 'Crédito', '2025-12-17 16:23:00', '2025-12-17 16:23:00', NULL),
(66, 29, NULL, 5, 95.00, '2025-12-16 21:00:00', 'PIX', '2025-12-17 16:58:31', '2025-12-17 16:58:31', NULL),
(67, 35, NULL, 5, 120.00, '2025-12-16 21:00:00', 'PIX', '2025-12-17 17:10:44', '2025-12-17 17:10:44', NULL),
(92, 23, NULL, 5, 95.00, '2025-01-09 21:00:00', 'DINHEIRO', '2025-12-29 20:21:57', '2025-12-29 20:21:57', NULL),
(93, 25, NULL, 5, 95.00, '2025-01-09 21:00:00', 'DINHEIRO', '2025-12-29 20:55:09', '2025-12-29 20:55:09', NULL),
(94, 22, NULL, 5, 185.99, '2025-12-28 21:00:00', 'PIX', '2025-12-29 21:08:25', '2025-12-29 21:08:25', NULL),
(95, NULL, 41, 5, 200.00, '2025-12-30 11:36:08', 'DINHEIRO', '2025-12-30 11:36:08', '2025-12-30 11:36:08', NULL),
(96, NULL, 42, 5, 400.00, '2025-12-30 11:42:05', 'PIX', '2025-12-30 11:42:05', '2025-12-30 11:42:05', NULL),
(97, NULL, 51, 5, 47.00, '2026-01-02 16:16:17', 'PIX', '2026-01-02 16:16:17', '2026-01-02 16:16:17', NULL),
(98, NULL, 52, 5, 3.00, '2026-01-02 16:16:43', 'PIX', '2026-01-02 16:16:43', '2026-01-02 16:16:43', NULL),
(99, NULL, 53, 5, 3.00, '2026-01-02 22:02:12', 'PIX', '2026-01-02 22:02:12', '2026-01-02 22:02:12', NULL),
(100, NULL, 54, 5, 10.50, '2026-01-02 22:02:21', 'DINHEIRO', '2026-01-02 22:02:21', '2026-01-02 22:02:21', NULL),
(101, NULL, 55, 5, 10.50, '2026-01-02 22:02:32', 'DINHEIRO', '2026-01-02 22:02:32', '2026-01-02 22:02:32', NULL),
(102, NULL, 56, 5, 3.00, '2026-01-02 22:15:15', 'DINHEIRO', '2026-01-02 22:15:15', '2026-01-02 22:15:15', NULL),
(103, NULL, 57, 5, 3.00, '2026-01-02 22:27:48', 'PIX', '2026-01-02 22:27:48', '2026-01-02 22:27:48', NULL),
(104, NULL, 58, 5, 3.00, '2026-01-02 22:28:15', 'DEBITO', '2026-01-02 22:28:15', '2026-01-02 22:28:15', NULL),
(105, NULL, 59, 5, 6.00, '2026-01-02 22:32:04', 'PIX', '2026-01-02 22:32:04', '2026-01-02 22:32:04', NULL),
(106, NULL, 60, 5, 6.00, '2026-01-02 22:32:22', 'CREDITO', '2026-01-02 22:32:22', '2026-01-02 22:32:22', NULL),
(107, NULL, 61, 5, 6.00, '2026-01-02 22:32:30', 'DEBITO', '2026-01-02 22:32:30', '2026-01-02 22:32:30', NULL),
(108, NULL, 62, 29, 35.00, '2026-01-14 19:18:40', 'PIX', '2026-01-14 19:18:40', '2026-01-14 19:18:40', NULL),
(109, NULL, 63, 29, 35.00, '2026-01-14 19:29:22', 'DEBITO', '2026-01-14 19:29:22', '2026-01-14 19:29:22', NULL),
(110, 40, NULL, 29, 95.00, '2026-01-14 21:00:00', 'DEBITO', '2026-01-15 11:36:37', '2026-01-15 11:36:37', NULL),
(111, NULL, 64, 29, 3.50, '2026-01-15 11:44:11', 'DEBITO', '2026-01-15 11:44:11', '2026-01-15 11:44:11', NULL),
(112, NULL, 65, 29, 3.50, '2026-01-15 14:52:44', 'DEBITO', '2026-01-15 14:52:44', '2026-01-15 14:52:44', NULL),
(113, NULL, 66, 29, 3.50, '2026-01-15 14:53:03', 'DEBITO', '2026-01-15 14:53:03', '2026-01-15 14:53:03', NULL),
(114, NULL, 67, 29, 3.00, '2026-01-15 14:54:08', 'DEBITO', '2026-01-15 14:54:08', '2026-01-15 14:54:08', NULL),
(115, NULL, 68, 29, 35.00, '2026-01-15 14:54:43', 'PIX', '2026-01-15 14:54:43', '2026-01-15 14:54:43', NULL),
(116, NULL, 69, 5, 8.00, '2026-01-15 14:55:43', 'PIX', '2026-01-15 14:55:43', '2026-01-15 14:55:43', NULL),
(117, NULL, 70, 5, 4.50, '2026-01-15 14:58:20', 'CREDITO', '2026-01-15 14:58:20', '2026-01-15 14:58:20', NULL),
(118, NULL, 71, 5, 3.50, '2026-01-15 15:02:30', 'DEBITO', '2026-01-15 15:02:30', '2026-01-15 15:02:30', NULL),
(119, NULL, 72, 29, 3.00, '2026-01-15 15:18:33', 'PIX', '2026-01-15 15:18:33', '2026-01-15 15:18:33', NULL),
(120, NULL, 73, 5, 74.80, '2026-01-15 15:19:17', 'DEBITO', '2026-01-15 15:19:17', '2026-01-15 15:19:17', NULL),
(121, NULL, 74, 29, 3.50, '2026-01-15 15:51:41', 'DEBITO', '2026-01-15 15:51:41', '2026-01-15 15:51:41', NULL),
(122, NULL, 75, 29, 35.00, '2026-01-15 17:19:21', 'DEBITO', '2026-01-15 17:19:21', '2026-01-15 17:19:21', NULL),
(123, NULL, 76, 29, 3.00, '2026-01-15 19:34:35', 'DEBITO', '2026-01-15 19:34:35', '2026-01-15 19:34:35', NULL),
(124, NULL, 77, 5, 3.50, '2026-01-15 19:55:55', 'PIX', '2026-01-15 19:55:55', '2026-01-15 19:55:55', NULL),
(125, NULL, 78, 30, 5.00, '2026-01-15 20:38:36', 'DEBITO', '2026-01-15 20:38:36', '2026-01-15 20:38:36', NULL),
(126, 41, NULL, 30, 185.00, '2026-01-14 21:00:00', 'DEBITO', '2026-01-15 20:44:28', '2026-01-15 20:44:28', NULL),
(127, NULL, 79, 30, 5.00, '2026-01-15 20:46:24', 'PIX', '2026-01-15 20:46:24', '2026-01-15 20:46:24', NULL),
(128, NULL, 80, 30, 35.00, '2026-01-15 20:46:45', 'DEBITO', '2026-01-15 20:46:45', '2026-01-15 20:46:45', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`id`, `userId`, `token`, `expiresAt`, `createdAt`, `updatedAt`) VALUES
(14, 1, '5902823940a7f8a9de2825f0c28feb6624b59725a7727c523fb8e5a1dc8af8b5', '2026-01-16 18:57:38', '2026-01-16 17:57:38', '2026-01-16 17:57:38'),
(19, 29, 'e4158b87b0f67127c94df57ff129c75f140877313a4dde259dadccfcb991cb1d', '2026-01-16 19:31:37', '2026-01-16 18:31:37', '2026-01-16 18:31:37');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `quantidade` int NOT NULL DEFAULT '0',
  `escolaId` int NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `preco`, `quantidade`, `escolaId`, `imageUrl`, `createdAt`, `updatedAt`) VALUES
(59, 'Sanduíche natural vegetariano', 12.50, 3, 5, 'foto-1767404416387-971620937.jpg', '2026-01-02 22:40:16', '2026-01-02 22:40:16'),
(60, 'Camiseta de dança - Preta - tamanho -M', 35.00, 6, 5, 'foto-1767404608133-504927732.jpg', '2026-01-02 22:43:28', '2026-01-02 22:43:28'),
(61, 'Camiseta de Dança - Branca - tamanho - M', 35.00, 5, 5, 'foto-1767404724478-95743106.jpg', '2026-01-02 22:45:24', '2026-01-02 22:45:24'),
(62, 'Água Mineral - Sem gás', 3.50, 5, 5, 'foto-1767404915277-310509066.jpg', '2026-01-02 22:48:35', '2026-01-15 19:55:55'),
(63, 'Água Mineral - Com gás', 3.50, 5, 5, 'foto-1767405027500-831938924.jpg', '2026-01-02 22:50:27', '2026-01-02 22:50:27'),
(65, 'Fanta Laranja 350ml Lata', 4.50, 5, 5, 'foto-1767405279739-902646954.jpg', '2026-01-02 22:54:39', '2026-01-02 22:54:39'),
(66, 'Refrigerante Coca-Cola Zero Lata 350ml', 4.50, 0, 5, 'foto-1767405423490-67283355.png', '2026-01-02 22:57:03', '2026-01-02 22:57:03'),
(67, 'Coca-Cola Original 350ml Lata', 4.50, 5, 5, 'foto-1767405580064-515858107.jpg', '2026-01-02 22:59:40', '2026-01-02 22:59:40'),
(70, 'Sapatilha  de Ballet Infantil', 74.80, 8, 5, 'foto-1767406242199-791929074.jpg', '2026-01-02 23:10:42', '2026-01-15 15:19:17'),
(72, 'Refrigerante - coca-Cola -Lata 350ml', 3.50, 4, 29, 'foto-1768488239812-585654375.jpg', '2026-01-15 11:43:59', '2026-01-15 15:51:41'),
(73, 'agua mineral', 3.00, 3, 29, 'foto-1768499627828-247610396.jpg', '2026-01-15 14:53:47', '2026-01-15 19:34:35'),
(74, 'Água Mineral com Gas', 3.50, 6, 29, 'foto-1768518055198-309745283.jpg', '2026-01-15 20:00:55', '2026-01-15 20:00:55'),
(75, 'Camiseta da Escola de Dança-cor preta - M', 35.00, 3, 29, 'foto-1768518138654-337336113.jpg', '2026-01-15 20:02:18', '2026-01-15 20:02:18'),
(77, 'camiseta da Escola de Dança - cor preta - M', 35.00, 5, 30, 'foto-1768520017222-91346023.jpg', '2026-01-15 20:33:37', '2026-01-15 20:33:37'),
(78, 'Camiseta da Escola de dança - cor branca - G', 35.00, 3, 30, 'foto-1768520076194-319088620.jpg', '2026-01-15 20:34:36', '2026-01-15 20:46:45'),
(79, 'Água  mineral com gas - 500ml', 4.50, 8, 30, 'foto-1768520169887-637358057.jpg', '2026-01-15 20:36:09', '2026-01-15 20:36:09'),
(80, 'Água  Mineral  Sem gas - 500m', 4.50, 6, 30, 'foto-1768520218776-178615912.jpg', '2026-01-15 20:36:58', '2026-01-15 20:36:58'),
(81, 'Coca-Cola Lata 350ml -zero', 5.00, 6, 30, 'foto-1768520294362-731941129.jpg', '2026-01-15 20:38:14', '2026-01-15 20:46:24');

-- --------------------------------------------------------

--
-- Estrutura para tabela `professor`
--

DROP TABLE IF EXISTS `professor`;
CREATE TABLE IF NOT EXISTS `professor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cpf` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `vinculo` enum('CLT','Autônomo','Comissão') NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `escolaId` int DEFAULT NULL,
  `percentualComissao` float DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `professor`
--

INSERT INTO `professor` (`id`, `nome`, `cpf`, `email`, `telefone`, `endereco`, `vinculo`, `ativo`, `createdAt`, `updatedAt`, `escolaId`, `percentualComissao`) VALUES
(1, 'Maria da Silva', '12345678901', 'maria.professora@example.com', '(11) 99999-0000', 'Rua Exemplo, 123', 'CLT', 1, '2025-09-18 10:17:49', '2025-09-18 10:17:49', NULL, 0),
(4, 'Carlos Silva', '12345678902', 'carlos.silva@exemplo.com', '11999998888', 'Rua Atualizada, 200', 'CLT', 0, '2025-09-23 07:25:52', '2025-09-23 07:28:27', 5, 0),
(9, 'Professor de Comissão', '22233344455', 'comissao@email.com', NULL, NULL, 'Comissão', 1, '2025-09-25 08:30:56', '2025-09-25 08:30:56', 5, 0),
(13, 'Roberto Ferreira', '85474547812', 'roberto@gmail.com', '(48)984656336', '', 'Autônomo', 1, '2025-10-09 14:29:21', '2025-10-09 14:29:21', NULL, 0),
(14, 'mamamam', '98765432101', 'lad@gmail.com', '41984156321', '', 'CLT', 1, '2025-10-09 14:31:40', '2025-10-09 14:31:40', NULL, 0),
(16, 'Maricota Machado', '85445874100', 'maricota@gmail.com', '41984156321', '', 'Comissão', 1, '2026-01-15 09:01:13', '2026-01-15 09:01:13', 29, 0),
(17, 'marcos Ferreira', '12345678911', 'marcos@gmail.com', '11984156321', '', 'Comissão', 1, '2026-01-15 09:44:24', '2026-01-15 09:44:24', 29, 0),
(18, 'Chico Treva da Silva', '8549658747', 'chico@gmail.com', '49984587415', '', 'CLT', 1, '2026-01-15 20:28:32', '2026-01-15 20:28:32', 30, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `professores_modalidades`
--

DROP TABLE IF EXISTS `professores_modalidades`;
CREATE TABLE IF NOT EXISTS `professores_modalidades` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `professorId` int NOT NULL,
  `modalidadeId` int NOT NULL,
  PRIMARY KEY (`professorId`,`modalidadeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `professores_modalidades`
--

INSERT INTO `professores_modalidades` (`createdAt`, `updatedAt`, `professorId`, `modalidadeId`) VALUES
('2025-09-23 08:22:56', '2025-09-23 08:22:56', 4, 3),
('2025-09-29 07:56:48', '2025-09-29 07:56:48', 9, 1),
('2026-01-15 09:42:10', '2026-01-15 09:42:10', 16, 7),
('2026-01-15 09:44:24', '2026-01-15 09:44:24', 17, 8),
('2026-01-15 20:28:32', '2026-01-15 20:28:32', 18, 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Despejando dados para a tabela `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250901131628-alter-user-add-superadmin.js'),
('20250913215717-add-admin-escola-to-user-perfil.js'),
('20250915143104-add-isencoes-taxa-table.js');

-- --------------------------------------------------------

--
-- Estrutura para tabela `splits`
--

DROP TABLE IF EXISTS `splits`;
CREATE TABLE IF NOT EXISTS `splits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contractId` int NOT NULL,
  `tipo` enum('PLATFORM','ESCOLA') NOT NULL COMMENT 'Quem recebe essa parte do split',
  `percentual` decimal(5,2) NOT NULL COMMENT 'Percentual aplicado sobre a transação',
  `destinatario` varchar(255) DEFAULT NULL COMMENT 'ID da conta no gateway (quando existir)',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_splits_contract` (`contractId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `transacoes_financeiras`
--

DROP TABLE IF EXISTS `transacoes_financeiras`;
CREATE TABLE IF NOT EXISTS `transacoes_financeiras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `escolaId` int NOT NULL,
  `pagamentoId` int DEFAULT NULL,
  `valorBruto` decimal(10,2) NOT NULL,
  `percentualPlataforma` decimal(5,2) NOT NULL DEFAULT '1.30',
  `valorPlataforma` decimal(10,2) NOT NULL DEFAULT '0.00',
  `valorEscola` decimal(10,2) NOT NULL DEFAULT '0.00',
  `isencaoAplicada` tinyint(1) NOT NULL DEFAULT '0',
  `gateway` varchar(255) NOT NULL DEFAULT 'PAGARME_EXEMPLO',
  `gatewayTransactionId` varchar(255) DEFAULT NULL,
  `status` enum('PENDENTE','PROCESSADO','ESTORNADO') NOT NULL DEFAULT 'PENDENTE',
  `dataProcessamento` datetime NOT NULL,
  `metadata` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `escolaId` (`escolaId`),
  KEY `pagamentoId` (`pagamentoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `turmas`
--

DROP TABLE IF EXISTS `turmas`;
CREATE TABLE IF NOT EXISTS `turmas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `horarioInicio` time DEFAULT NULL,
  `horarioFim` time DEFAULT NULL,
  `diaDaSemana` varchar(255) DEFAULT NULL,
  `maxAlunos` int DEFAULT NULL,
  `escolaId` int DEFAULT NULL,
  `modalidadeId` int NOT NULL,
  `professorId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `turmas`
--

INSERT INTO `turmas` (`id`, `nome`, `horarioInicio`, `horarioFim`, `diaDaSemana`, `maxAlunos`, `escolaId`, `modalidadeId`, `professorId`, `createdAt`, `updatedAt`) VALUES
(7, 'Turma Teste', '10:00:00', '11:00:00', 'Segunda-feira', 15, NULL, 1, 1, '2025-09-18 10:18:47', '2025-09-19 08:03:58'),
(8, 'Turma de Ballet - 10h', NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-09-18 10:26:15', '2025-09-18 10:26:15'),
(9, 'Turma Teste Completa', '10:00:00', '11:00:00', 'Segunda-feira', 20, NULL, 1, 1, '2025-09-19 08:31:42', '2025-09-19 08:31:42'),
(10, 'Turma Teste', '08:00:00', '10:00:00', 'Segunda', 20, NULL, 1, 1, '2025-09-19 09:40:30', '2025-09-19 09:40:30'),
(11, 'Turma Jazz Master', '16:00:00', '17:32:00', ', Terça-feira, Sexta-feira', 18, 5, 1, 4, '2025-09-23 07:51:38', '2025-12-11 16:40:22'),
(13, 'Turma Jazz Avançado', '16:00:00', '17:30:00', 'Sexta-feira', 20, 5, 3, 4, '2025-09-24 10:59:45', '2025-09-24 10:59:45'),
(17, 'Ballet Clássico', NULL, NULL, NULL, NULL, 5, 0, 0, '2025-10-29 10:56:46', '2025-10-29 10:56:46'),
(18, 'Turma Jazz Master', '09:30:00', '11:00:00', 'Quinta-feira', 10, 29, 3, 16, '2026-01-15 09:03:23', '2026-01-15 09:03:23'),
(19, 'Dança de rua(Hip Hop)', '09:30:00', '10:40:00', 'Segunda-feira, Quarta-feira, Sexta-feira', 10, 30, 10, 18, '2026-01-15 20:30:36', '2026-01-15 20:30:36');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `perfil` enum('SUPER_ADMIN','ADMIN_ESCOLA','USUARIO') NOT NULL DEFAULT 'USUARIO',
  `escolaId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `nome`, `email`, `password`, `perfil`, `escolaId`, `createdAt`, `updatedAt`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(1, 'Super Admin', 'valdemir.marques1925@gmail.com', '$2b$10$2w2Xik9yI3nJWXi.cXcLZOMiN5/B77Gcsk.KZ6TK6B0GJjo/WsKEC', 'SUPER_ADMIN', NULL, '2025-09-18 09:00:58', '2025-09-18 09:00:58', NULL, NULL),
(4, 'Admin Escola Teste', 'admin@escolateste.com', '$2b$10$Pd8No1hOxdrYl7uwjs3J7eNiQZIy1dooMYqI8Ds710fzUicTr9uFe', 'ADMIN_ESCOLA', 5, '2025-09-24 09:28:54', '2025-09-24 09:28:54', NULL, NULL),
(5, 'João da Silva', 'joao@teste.com', '$2b$10$k9UHMjjllQTGGasIM5b8BeMulscTbpdI8vLOpd8.scfje8fzU984O', 'ADMIN_ESCOLA', 7, '2026-01-13 08:23:21', '2026-01-13 08:23:21', NULL, NULL),
(6, 'Maria Ativacao', 'maria.ativacao@teste.com', '$2b$10$4NF30yjTjNAo7AwkldQzxer1fmJl74/jJZZX5A6dxpP/AWByOk25e', 'ADMIN_ESCOLA', 8, '2026-01-13 08:34:42', '2026-01-13 08:34:42', NULL, NULL),
(7, 'val', 'val@gmail.com', '$2b$10$Up0ATccKKXRuiBBvtfrfKeWeeO9mVtavLgLwD17tmr0AoK75PkTha', 'ADMIN_ESCOLA', 9, '2026-01-13 09:51:07', '2026-01-13 09:51:07', NULL, NULL),
(8, 'Teste Ativacao', 'teste.ativacao@exemplo.com', '$2b$10$f6G2gc89IFWGO8t2u1ARXeBzYQm6uLKnb7sdPw/mZoCZAnU05B1di', 'ADMIN_ESCOLA', 10, '2026-01-13 11:45:12', '2026-01-13 11:45:12', NULL, NULL),
(9, 'Teste Ativação Frontend', 'frontend.teste@exemplo.com', '$2b$10$PIrds0yOofFfPCsZuVzdaOLKyVOS0aa5HrDU1jjN7a6hMy2MO5flq', 'ADMIN_ESCOLA', 11, '2026-01-13 12:06:40', '2026-01-13 12:06:40', NULL, NULL),
(10, 'valdeco', 'valdeco@gmail.com', '$2b$10$8hxKiOY./3CObEWMhfXgA.Vy3WBDgoqLrrKjQRC2wFchGwiNfOZqW', 'ADMIN_ESCOLA', 12, '2026-01-13 13:15:46', '2026-01-13 13:15:46', NULL, NULL),
(12, 'valu', 'valu@gmail.com', '$2b$10$LJzO.8Q5jsQWjBJbHKKd/eqM9ybeSOyKqj629KJc5n9S8IlMFigou', 'ADMIN_ESCOLA', 14, '2026-01-13 15:15:40', '2026-01-13 15:15:40', NULL, NULL),
(13, 'valu', 'valu1@gmail.com', '$2b$10$o184TARG3fMGJhdUrtDUK.p3cn.ZQHH3okr2n8bcGvRyH0uzxy1fa', 'ADMIN_ESCOLA', 15, '2026-01-13 15:18:25', '2026-01-13 15:18:25', NULL, NULL),
(14, 'geraldo', 'geraldo@gmail.com', '$2b$10$GVt7cwS4KXJZi7ln0hlNgO79r6E2tYePb7SPcLWyyhsZ4OHnUXhoO', 'ADMIN_ESCOLA', 16, '2026-01-13 17:53:02', '2026-01-13 17:53:02', NULL, NULL),
(15, 'teste', 'maria@gmail.com', '$2b$10$lkwNYHawgQa/ph7/42MxEuyc6IP4BaPVg2N9UhvDuIoMP0qiU37Oa', 'ADMIN_ESCOLA', 17, '2026-01-13 17:59:46', '2026-01-13 17:59:46', NULL, NULL),
(22, 'Tinoco', 'tinoco1@gmail.com', '$2b$10$5QI8pwsvv3VnntWy/D.NduLWHUXpSMqTuKB.xUjm2ocVB0lmHu8je', 'ADMIN_ESCOLA', 24, '2026-01-14 08:11:45', '2026-01-14 08:11:45', NULL, NULL),
(23, 'Teste Ativacao', 'testeativacao@teste.com', '$2b$10$mLI1NV0Z7s8us20Com1flOqFo98kdE9tDutS9LAItS7fiDTsszBu2', 'ADMIN_ESCOLA', 25, '2026-01-14 12:01:07', '2026-01-14 12:01:07', NULL, NULL),
(24, 'Dinoco', 'dinoco@gmail.com', '$2b$10$WobpgHHYttyA9w2A6PBVgObSGbUHH7liZQX9nOILhAahUCj.yMd/K', 'ADMIN_ESCOLA', 26, '2026-01-14 12:43:19', '2026-01-14 12:43:19', NULL, NULL),
(25, 'Dicoco Te', 'dinoco1@gmail.com', '$2b$10$QvQGcDUK9.XfYWT0WLOJBelU2BL/AzC8G.kpDF0Kqj2oWMb7K0NeG', 'ADMIN_ESCOLA', 27, '2026-01-14 14:23:20', '2026-01-14 14:23:20', NULL, NULL),
(26, 'marcos', 'marcos@gmail.com', '$2b$10$CQokK.i2F6Efv.IQcwgUAOlKPMYApTUFcB9XtfUMC1b2cHuj4fDi2', 'ADMIN_ESCOLA', 28, '2026-01-14 14:50:27', '2026-01-14 14:50:27', NULL, NULL),
(27, 'Dia', 'dia@gmail.com', '$2b$10$3lJl4VBCGtQANEtdTDLJr.Ai0nVso8cURQRTMxU.7BwQDL0Hcn9mu', 'ADMIN_ESCOLA', 29, '2026-01-14 17:18:59', '2026-01-14 17:18:59', NULL, NULL),
(28, 'Ricardo Boeira Marinho', 'ricardo@gmail.com', '$2b$10$WfQQN3pP06mToFx.Wm6Xm.ecbXIJdqHNkW4F9fT6MXpZ7V2hI1ze2', 'ADMIN_ESCOLA', 30, '2026-01-15 20:19:32', '2026-01-15 20:19:32', NULL, NULL),
(29, 'Vladi', 'valdemir.m@aluno.ifsc.edu.br', '$2b$10$JG0ZYMxAuDTOubsbcgHnYuwE0cTngfM5SMj2plBnGHl4HvqIu7Itu', 'ADMIN_ESCOLA', 31, '2026-01-16 08:40:34', '2026-01-16 18:03:44', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `vendaitems`
--

DROP TABLE IF EXISTS `vendaitems`;
CREATE TABLE IF NOT EXISTS `vendaitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantidade` int NOT NULL,
  `precoUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `vendaId` int NOT NULL,
  `produtoId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `vendaitems`
--

INSERT INTO `vendaitems` (`id`, `quantidade`, `precoUnitario`, `subtotal`, `vendaId`, `produtoId`, `createdAt`, `updatedAt`) VALUES
(43, 1, 200.00, 200.00, 40, 1, '2025-12-30 10:08:12', '2025-12-30 10:08:12'),
(44, 1, 200.00, 200.00, 41, 48, '2025-12-30 11:36:08', '2025-12-30 11:36:08'),
(45, 2, 200.00, 400.00, 42, 48, '2025-12-30 11:42:05', '2025-12-30 11:42:05'),
(46, 1, 3.00, 3.00, 43, 42, '2026-01-02 15:13:33', '2026-01-02 15:13:33'),
(47, 1, 4.50, 4.50, 43, 43, '2026-01-02 15:13:33', '2026-01-02 15:13:33'),
(48, 1, 3.00, 3.00, 44, 42, '2026-01-02 15:14:46', '2026-01-02 15:14:46'),
(49, 1, 4.50, 4.50, 44, 43, '2026-01-02 15:14:46', '2026-01-02 15:14:46'),
(50, 1, 3.00, 3.00, 44, 49, '2026-01-02 15:14:46', '2026-01-02 15:14:46'),
(51, 1, 3.00, 3.00, 45, 49, '2026-01-02 15:22:46', '2026-01-02 15:22:46'),
(52, 1, 3.00, 3.00, 46, 50, '2026-01-02 15:28:16', '2026-01-02 15:28:16'),
(53, 1, 3.00, 3.00, 47, 50, '2026-01-02 15:28:20', '2026-01-02 15:28:20'),
(54, 1, 3.00, 3.00, 48, 51, '2026-01-02 15:35:35', '2026-01-02 15:35:35'),
(55, 1, 3.00, 3.00, 49, 51, '2026-01-02 15:35:40', '2026-01-02 15:35:40'),
(56, 1, 3.00, 3.00, 50, 51, '2026-01-02 15:37:10', '2026-01-02 15:37:10'),
(57, 1, 47.00, 47.00, 51, 47, '2026-01-02 16:16:17', '2026-01-02 16:16:17'),
(58, 1, 3.00, 3.00, 52, 42, '2026-01-02 16:16:43', '2026-01-02 16:16:43'),
(59, 1, 3.00, 3.00, 53, 54, '2026-01-02 22:02:12', '2026-01-02 22:02:12'),
(60, 1, 10.50, 10.50, 54, 53, '2026-01-02 22:02:21', '2026-01-02 22:02:21'),
(61, 1, 10.50, 10.50, 55, 53, '2026-01-02 22:02:32', '2026-01-02 22:02:32'),
(62, 1, 3.00, 3.00, 56, 56, '2026-01-02 22:15:15', '2026-01-02 22:15:15'),
(63, 1, 3.00, 3.00, 57, 54, '2026-01-02 22:27:48', '2026-01-02 22:27:48'),
(64, 1, 3.00, 3.00, 58, 56, '2026-01-02 22:28:15', '2026-01-02 22:28:15'),
(65, 1, 6.00, 6.00, 59, 57, '2026-01-02 22:32:04', '2026-01-02 22:32:04'),
(66, 1, 6.00, 6.00, 60, 57, '2026-01-02 22:32:22', '2026-01-02 22:32:22'),
(67, 1, 6.00, 6.00, 61, 57, '2026-01-02 22:32:30', '2026-01-02 22:32:30'),
(68, 1, 35.00, 35.00, 62, 71, '2026-01-14 19:18:40', '2026-01-14 19:18:40'),
(69, 1, 35.00, 35.00, 63, 71, '2026-01-14 19:29:22', '2026-01-14 19:29:22'),
(70, 1, 3.50, 3.50, 64, 72, '2026-01-15 11:44:11', '2026-01-15 11:44:11'),
(71, 1, 3.50, 3.50, 65, 72, '2026-01-15 14:52:44', '2026-01-15 14:52:44'),
(72, 1, 3.50, 3.50, 66, 72, '2026-01-15 14:53:03', '2026-01-15 14:53:03'),
(73, 1, 3.00, 3.00, 67, 73, '2026-01-15 14:54:08', '2026-01-15 14:54:08'),
(74, 1, 35.00, 35.00, 68, 71, '2026-01-15 14:54:43', '2026-01-15 14:54:43'),
(75, 1, 4.50, 4.50, 69, 67, '2026-01-15 14:55:43', '2026-01-15 14:55:43'),
(76, 1, 3.50, 3.50, 69, 62, '2026-01-15 14:55:43', '2026-01-15 14:55:43'),
(77, 1, 4.50, 4.50, 70, 65, '2026-01-15 14:58:20', '2026-01-15 14:58:20'),
(78, 1, 3.50, 3.50, 71, 63, '2026-01-15 15:02:30', '2026-01-15 15:02:30'),
(79, 1, 3.00, 3.00, 72, 73, '2026-01-15 15:18:33', '2026-01-15 15:18:33'),
(80, 1, 74.80, 74.80, 73, 70, '2026-01-15 15:19:17', '2026-01-15 15:19:17'),
(81, 1, 3.50, 3.50, 74, 72, '2026-01-15 15:51:41', '2026-01-15 15:51:41'),
(82, 1, 35.00, 35.00, 75, 71, '2026-01-15 17:19:21', '2026-01-15 17:19:21'),
(83, 1, 3.00, 3.00, 76, 73, '2026-01-15 19:34:35', '2026-01-15 19:34:35'),
(84, 1, 3.50, 3.50, 77, 62, '2026-01-15 19:55:55', '2026-01-15 19:55:55'),
(85, 1, 5.00, 5.00, 78, 81, '2026-01-15 20:38:36', '2026-01-15 20:38:36'),
(86, 1, 5.00, 5.00, 79, 81, '2026-01-15 20:46:24', '2026-01-15 20:46:24'),
(87, 1, 35.00, 35.00, 80, 78, '2026-01-15 20:46:45', '2026-01-15 20:46:45');

-- --------------------------------------------------------

--
-- Estrutura para tabela `vendas`
--

DROP TABLE IF EXISTS `vendas`;
CREATE TABLE IF NOT EXISTS `vendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `totalBruto` decimal(10,2) NOT NULL,
  `totalDescontos` decimal(10,2) DEFAULT '0.00',
  `totalLiquido` decimal(10,2) NOT NULL,
  `metodoPagamento` varchar(255) NOT NULL,
  `dataVenda` datetime NOT NULL,
  `status` enum('Pendente','Concluida','Cancelada') NOT NULL DEFAULT 'Pendente',
  `escolaId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `alunoId` int DEFAULT NULL,
  `usuarioId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `vendas`
--

INSERT INTO `vendas` (`id`, `totalBruto`, `totalDescontos`, `totalLiquido`, `metodoPagamento`, `dataVenda`, `status`, `escolaId`, `createdAt`, `updatedAt`, `alunoId`, `usuarioId`) VALUES
(40, 200.00, 0.00, 200.00, 'DINHEIRO', '2025-12-29 00:00:00', '', 5, '2025-12-30 10:08:12', '2025-12-30 10:08:12', 1, 1),
(41, 200.00, 0.00, 200.00, 'DINHEIRO', '2025-12-30 11:36:08', 'Pendente', 5, '2025-12-30 11:36:08', '2025-12-30 11:36:08', 1, 1),
(42, 400.00, 0.00, 400.00, 'PIX', '2025-12-30 11:42:05', 'Pendente', 5, '2025-12-30 11:42:05', '2025-12-30 11:42:05', 1, 1),
(43, 7.50, 0.00, 7.50, 'CREDITO', '2026-01-02 15:13:32', '', 5, '2026-01-02 15:13:32', '2026-01-02 15:13:32', NULL, 4),
(44, 10.50, 0.00, 10.50, 'CREDITO', '2026-01-02 15:14:46', '', 5, '2026-01-02 15:14:46', '2026-01-02 15:14:46', NULL, 4),
(45, 3.00, 0.00, 3.00, 'DEBITO', '2026-01-02 15:22:46', '', 5, '2026-01-02 15:22:46', '2026-01-02 15:22:46', NULL, 4),
(46, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 15:28:16', '', 5, '2026-01-02 15:28:16', '2026-01-02 15:28:16', NULL, 4),
(47, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 15:28:20', '', 5, '2026-01-02 15:28:20', '2026-01-02 15:28:20', NULL, 4),
(48, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 15:35:35', '', 5, '2026-01-02 15:35:35', '2026-01-02 15:35:35', NULL, 4),
(49, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 15:35:40', '', 5, '2026-01-02 15:35:40', '2026-01-02 15:35:40', NULL, 4),
(50, 3.00, 0.00, 3.00, 'DEBITO', '2026-01-02 15:37:10', '', 5, '2026-01-02 15:37:10', '2026-01-02 15:37:10', NULL, 4),
(51, 47.00, 0.00, 47.00, 'PIX', '2026-01-02 16:16:17', 'Pendente', 5, '2026-01-02 16:16:17', '2026-01-02 16:16:17', NULL, 4),
(52, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 16:16:43', 'Pendente', 5, '2026-01-02 16:16:43', '2026-01-02 16:16:43', NULL, 4),
(53, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 22:02:12', 'Pendente', 5, '2026-01-02 22:02:12', '2026-01-02 22:02:12', NULL, 4),
(54, 10.50, 0.00, 10.50, 'DINHEIRO', '2026-01-02 22:02:21', 'Pendente', 5, '2026-01-02 22:02:21', '2026-01-02 22:02:21', NULL, 4),
(55, 10.50, 0.00, 10.50, 'DINHEIRO', '2026-01-02 22:02:32', 'Pendente', 5, '2026-01-02 22:02:32', '2026-01-02 22:02:32', NULL, 4),
(56, 3.00, 0.00, 3.00, 'DINHEIRO', '2026-01-02 22:15:15', 'Pendente', 5, '2026-01-02 22:15:15', '2026-01-02 22:15:15', NULL, 4),
(57, 3.00, 0.00, 3.00, 'PIX', '2026-01-02 22:27:48', 'Pendente', 5, '2026-01-02 22:27:48', '2026-01-02 22:27:48', NULL, 4),
(58, 3.00, 0.00, 3.00, 'DEBITO', '2026-01-02 22:28:15', 'Pendente', 5, '2026-01-02 22:28:15', '2026-01-02 22:28:15', NULL, 4),
(59, 6.00, 0.00, 6.00, 'PIX', '2026-01-02 22:32:04', 'Pendente', 5, '2026-01-02 22:32:04', '2026-01-02 22:32:04', NULL, 4),
(60, 6.00, 0.00, 6.00, 'CREDITO', '2026-01-02 22:32:22', 'Pendente', 5, '2026-01-02 22:32:22', '2026-01-02 22:32:22', NULL, 4),
(61, 6.00, 0.00, 6.00, 'DEBITO', '2026-01-02 22:32:30', 'Pendente', 5, '2026-01-02 22:32:30', '2026-01-02 22:32:30', NULL, 4),
(62, 35.00, 0.00, 35.00, 'PIX', '2026-01-14 19:18:40', 'Concluida', 29, '2026-01-14 19:18:40', '2026-01-14 19:18:40', NULL, 27),
(63, 35.00, 0.00, 35.00, 'DEBITO', '2026-01-14 19:29:22', 'Concluida', 29, '2026-01-14 19:29:22', '2026-01-14 19:29:22', NULL, 27),
(64, 3.50, 0.00, 3.50, 'DEBITO', '2026-01-15 11:44:11', 'Concluida', 29, '2026-01-15 11:44:11', '2026-01-15 11:44:11', NULL, 27),
(65, 3.50, 0.00, 3.50, 'DEBITO', '2026-01-15 14:52:44', 'Concluida', 29, '2026-01-15 14:52:44', '2026-01-15 14:52:44', NULL, 27),
(66, 3.50, 0.00, 3.50, 'DEBITO', '2026-01-15 14:53:03', 'Concluida', 29, '2026-01-15 14:53:03', '2026-01-15 14:53:03', NULL, 27),
(67, 3.00, 0.00, 3.00, 'DEBITO', '2026-01-15 14:54:08', 'Concluida', 29, '2026-01-15 14:54:08', '2026-01-15 14:54:08', NULL, 27),
(68, 35.00, 0.00, 35.00, 'PIX', '2026-01-15 14:54:43', 'Concluida', 29, '2026-01-15 14:54:43', '2026-01-15 14:54:43', NULL, 27),
(69, 8.00, 0.00, 8.00, 'PIX', '2026-01-15 14:55:43', 'Concluida', 5, '2026-01-15 14:55:43', '2026-01-15 14:55:43', NULL, 4),
(70, 4.50, 0.00, 4.50, 'CREDITO', '2026-01-15 14:58:20', 'Concluida', 5, '2026-01-15 14:58:20', '2026-01-15 14:58:20', NULL, 4),
(71, 3.50, 0.00, 3.50, 'DEBITO', '2026-01-15 15:02:30', 'Concluida', 5, '2026-01-15 15:02:30', '2026-01-15 15:02:30', NULL, 4),
(72, 3.00, 0.00, 3.00, 'PIX', '2026-01-15 15:18:33', 'Concluida', 29, '2026-01-15 15:18:33', '2026-01-15 15:18:33', NULL, 27),
(73, 74.80, 0.00, 74.80, 'DEBITO', '2026-01-15 15:19:17', 'Concluida', 5, '2026-01-15 15:19:17', '2026-01-15 15:19:17', NULL, 4),
(74, 3.50, 0.00, 3.50, 'DEBITO', '2026-01-15 15:51:41', 'Concluida', 29, '2026-01-15 15:51:41', '2026-01-15 15:51:41', NULL, 27),
(75, 35.00, 0.00, 35.00, 'DEBITO', '2026-01-15 17:19:21', 'Concluida', 29, '2026-01-15 17:19:21', '2026-01-15 17:19:21', NULL, 27),
(76, 3.00, 0.00, 3.00, 'DEBITO', '2026-01-15 19:34:35', 'Concluida', 29, '2026-01-15 19:34:35', '2026-01-15 19:34:35', NULL, 27),
(77, 3.50, 0.00, 3.50, 'PIX', '2026-01-15 19:55:55', 'Concluida', 5, '2026-01-15 19:55:55', '2026-01-15 19:55:55', NULL, 4),
(78, 5.00, 0.00, 5.00, 'DEBITO', '2026-01-15 20:38:36', 'Concluida', 30, '2026-01-15 20:38:36', '2026-01-15 20:38:36', NULL, 28),
(79, 5.00, 0.00, 5.00, 'PIX', '2026-01-15 20:46:24', 'Concluida', 30, '2026-01-15 20:46:24', '2026-01-15 20:46:24', NULL, 28),
(80, 35.00, 0.00, 35.00, 'DEBITO', '2026-01-15 20:46:45', 'Concluida', 30, '2026-01-15 20:46:45', '2026-01-15 20:46:45', NULL, 28);

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `alunos`
--
ALTER TABLE `alunos`
  ADD CONSTRAINT `fk_alunos_escola` FOREIGN KEY (`escolaId`) REFERENCES `escolas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `transacoes_financeiras`
--
ALTER TABLE `transacoes_financeiras`
  ADD CONSTRAINT `transacoes_financeiras_ibfk_1` FOREIGN KEY (`escolaId`) REFERENCES `escolas` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `transacoes_financeiras_ibfk_2` FOREIGN KEY (`pagamentoId`) REFERENCES `pagamentos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
