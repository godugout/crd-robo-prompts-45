
-- Create a function to count reactions by type
CREATE OR REPLACE FUNCTION count_reactions_by_type(
  memory_id text DEFAULT NULL,
  collection_id text DEFAULT NULL,
  comment_id text DEFAULT NULL
)
RETURNS TABLE (type text, count bigint)
LANGUAGE sql
AS $$
  SELECT 
    type, 
    COUNT(*) as count
  FROM reactions
  WHERE 
    (memory_id IS NULL OR reactions.memory_id = memory_id) AND
    (collection_id IS NULL OR reactions.collection_id = collection_id) AND
    (comment_id IS NULL OR reactions.comment_id = comment_id)
  GROUP BY type
$$;
