-- Ajout des colonnes nécessaires pour le Kanban
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Préparatif';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Mise à jour des valeurs status pour correspondre au Kanban
UPDATE tasks SET status = 'À faire' WHERE status = 'todo';
UPDATE tasks SET status = 'Fait' WHERE status = 'done';

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_tasks_crew_status ON tasks(crew_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON tasks(position);
