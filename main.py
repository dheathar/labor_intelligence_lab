"""Entry point for the Labor Intelligence Virtual Lab."""
import sys
from pathlib import Path

if __name__ == "__main__":
    import uvicorn
    sys.path.insert(0, str(Path(__file__).parent))
    uvicorn.run(
        "scripts.serve:app",
        host="0.0.0.0",
        port=8766,
        reload=True,
        reload_dirs=["scripts", "config", "knowledge"],
        log_level="info",
    )
