-- CreateTable
CREATE TABLE `tbl_administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `senha` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_aluno` (
    `idAluno` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula` VARCHAR(20) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(20) NOT NULL,
    `id_turma` INTEGER NOT NULL,
    `id_tabela_desempenho` INTEGER NULL,

    UNIQUE INDEX `id`(`idAluno`),
    INDEX `FK_TABELADESEMPENHO_Aluno`(`id_tabela_desempenho`),
    INDEX `FK_TURMA_Aluno`(`id_turma`),
    PRIMARY KEY (`idAluno`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_aluno_avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_aluno` INTEGER NOT NULL,
    `id_avaliacao` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_ALUNO_AlunoAvaliacao`(`id_aluno`),
    INDEX `FK_AVALIACAO_AlunoAvaliacao`(`id_avaliacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_avaliacao` (
    `idAvaliacao` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `duracao` TIME(0) NOT NULL,
    `criticos_acertados` INTEGER NULL,
    `desejados_acertados` INTEGER NULL,
    `id_registro_tempo` INTEGER NULL,
    `id_tabela_desempenho` INTEGER NULL,
    `id_professor` INTEGER NOT NULL,
    `somativa` BOOLEAN NULL,
    `concluida` BOOLEAN NULL,
    `id_turma` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`idAvaliacao`),
    INDEX `FK_PROFESSOR_Avaliacao`(`id_professor`),
    INDEX `FK_REGISTROTEMPO_Avaliacao`(`id_registro_tempo`),
    INDEX `FK_TABELADESEMPENHO_Avaliacao`(`id_tabela_desempenho`),
    INDEX `FK_TURMA_Avaliacao`(`id_turma`),
    PRIMARY KEY (`idAvaliacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_criterio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` TEXT NOT NULL,
    `observacao` TEXT NULL,
    `id_verificacao` INTEGER NULL,
    `id_resultado` INTEGER NULL,
    `id_avaliacao` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_AVALIACAO_Criterio`(`id_avaliacao`),
    INDEX `FK_RESULTADO_Criterio`(`id_resultado`),
    INDEX `FK_VERIFICACAO_Criterio`(`id_verificacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_materia` (
    `idMateria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `sigla` VARCHAR(5) NULL,

    UNIQUE INDEX `id`(`idMateria`),
    PRIMARY KEY (`idMateria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_periodo` (
    `idPeriodo` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `sigla` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `id`(`idPeriodo`),
    PRIMARY KEY (`idPeriodo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_periodo_turma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_periodo` INTEGER NOT NULL,
    `id_turma` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_PERIODO_PeriodoTurma`(`id_periodo`),
    INDEX `FK_TURMA_Periodoturma`(`id_turma`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_professor` (
    `idProfessor` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `id`(`idProfessor`),
    PRIMARY KEY (`idProfessor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_professor_materia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_professor` INTEGER NOT NULL,
    `id_materia` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_MATERIA_ProfessorMateria`(`id_materia`),
    INDEX `FK_PROFESSOR_ProfessorMateria`(`id_professor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_registro_tempo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_registro` DATE NULL,
    `hora_inicio` TIME(0) NULL,
    `hora_termino` TIME(0) NULL,
    `hora_descontada` TIME(0) NULL,
    `hora_liquida` TIME(0) NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_resultado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resultado_desejado` VARCHAR(25) NOT NULL,
    `resultado_obtido` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_semestre` (
    `idSemestre` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_semestre` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `id`(`idSemestre`),
    PRIMARY KEY (`idSemestre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_tabela_desempenho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nota_nivel` INTEGER NOT NULL,
    `nota` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_turma` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `sigla` VARCHAR(5) NOT NULL,
    `id_semestre` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_SEMESTRE_Turma`(`id_semestre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_turma_professor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_professor` INTEGER NOT NULL,
    `id_turma` INTEGER NOT NULL,

    UNIQUE INDEX `id`(`id`),
    INDEX `FK_PROFESSOR_TurmaProfessor`(`id_professor`),
    INDEX `FK_TURMA_TurmaProfessor`(`id_turma`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_verificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verificacao_aluno` VARCHAR(5) NOT NULL,
    `confirmacao_professor` VARCHAR(5) NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_aluno` ADD CONSTRAINT `FK_TABELADESEMPENHO_Aluno` FOREIGN KEY (`id_tabela_desempenho`) REFERENCES `tbl_tabela_desempenho`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_aluno` ADD CONSTRAINT `FK_TURMA_Aluno` FOREIGN KEY (`id_turma`) REFERENCES `tbl_turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_aluno_avaliacao` ADD CONSTRAINT `FK_ALUNO_AlunoAvaliacao` FOREIGN KEY (`id_aluno`) REFERENCES `tbl_aluno`(`idAluno`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_aluno_avaliacao` ADD CONSTRAINT `FK_AVALIACAO_AlunoAvaliacao` FOREIGN KEY (`id_avaliacao`) REFERENCES `tbl_avaliacao`(`idAvaliacao`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_avaliacao` ADD CONSTRAINT `FK_PROFESSOR_Avaliacao` FOREIGN KEY (`id_professor`) REFERENCES `tbl_professor`(`idProfessor`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_avaliacao` ADD CONSTRAINT `FK_REGISTROTEMPO_Avaliacao` FOREIGN KEY (`id_registro_tempo`) REFERENCES `tbl_registro_tempo`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_avaliacao` ADD CONSTRAINT `FK_TABELADESEMPENHO_Avaliacao` FOREIGN KEY (`id_tabela_desempenho`) REFERENCES `tbl_tabela_desempenho`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_avaliacao` ADD CONSTRAINT `FK_TURMA_Avaliacao` FOREIGN KEY (`id_turma`) REFERENCES `tbl_turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_criterio` ADD CONSTRAINT `FK_AVALIACAO_Criterio` FOREIGN KEY (`id_avaliacao`) REFERENCES `tbl_avaliacao`(`idAvaliacao`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_criterio` ADD CONSTRAINT `FK_RESULTADO_Criterio` FOREIGN KEY (`id_resultado`) REFERENCES `tbl_resultado`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_criterio` ADD CONSTRAINT `FK_VERIFICACAO_Criterio` FOREIGN KEY (`id_verificacao`) REFERENCES `tbl_verificacao`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_periodo_turma` ADD CONSTRAINT `FK_PERIODO_PeriodoTurma` FOREIGN KEY (`id_periodo`) REFERENCES `tbl_periodo`(`idPeriodo`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_periodo_turma` ADD CONSTRAINT `FK_TURMA_Periodoturma` FOREIGN KEY (`id_turma`) REFERENCES `tbl_turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_professor_materia` ADD CONSTRAINT `FK_MATERIA_ProfessorMateria` FOREIGN KEY (`id_materia`) REFERENCES `tbl_materia`(`idMateria`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_professor_materia` ADD CONSTRAINT `FK_PROFESSOR_ProfessorMateria` FOREIGN KEY (`id_professor`) REFERENCES `tbl_professor`(`idProfessor`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_turma` ADD CONSTRAINT `FK_SEMESTRE_Turma` FOREIGN KEY (`id_semestre`) REFERENCES `tbl_semestre`(`idSemestre`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_turma_professor` ADD CONSTRAINT `FK_PROFESSOR_TurmaProfessor` FOREIGN KEY (`id_professor`) REFERENCES `tbl_professor`(`idProfessor`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tbl_turma_professor` ADD CONSTRAINT `FK_TURMA_TurmaProfessor` FOREIGN KEY (`id_turma`) REFERENCES `tbl_turma`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

