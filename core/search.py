from core.normalizer import normalize_section_query

def search_section(query: str, sections: dict):
    section_id = normalize_section_query(query)
    if not section_id:
        return None
    return sections.get(section_id)
