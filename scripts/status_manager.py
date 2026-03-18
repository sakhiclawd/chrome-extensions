import sys
import os
import json

def get_projects():
    path = "Chrome-Extensions/PROJECTS.md"
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        lines = f.readlines()
    
    projects = []
    current_section = None
    for line in lines:
        if line.startswith("## Extension Registry"):
            current_section = "registry"
            continue
        if current_section == "registry" and "|" in line and "ID |" not in line and "---" not in line:
            parts = [p.strip() for p in line.split("|") if p.strip()]
            if len(parts) >= 4:
                projects.append({
                    "id": parts[0],
                    "name": parts[1],
                    "status": parts[3]
                })
    return projects

def update_status(project_id, new_status):
    path = "Chrome-Extensions/PROJECTS.md"
    with open(path, "r") as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if "|" in line and line.strip().startswith(f"| {project_id}"):
            parts = line.split("|")
            parts[4] = f" {new_status} "
            line = "|".join(parts)
        new_lines.append(line)
    
    with open(path, "w") as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python status_manager.py <id> <status>")
        sys.exit(1)
    update_status(sys.argv[1], sys.argv[2])
