"""APScheduler wrapper — registers rats and fires them on a cron schedule."""
import logging
from typing import Callable

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

_scheduler = BackgroundScheduler(timezone="UTC")


def schedule(rat_fn: Callable, hours: int = 1, minutes: int = 0, run_now: bool = True):
    """Register a rat function to run on an interval. Optionally run immediately on start."""
    _scheduler.add_job(
        rat_fn,
        trigger=IntervalTrigger(hours=hours, minutes=minutes),
        id=rat_fn.__name__,
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    if run_now:
        _scheduler.add_job(rat_fn, id=f"{rat_fn.__name__}_boot", replace_existing=True)


def start():
    if not _scheduler.running:
        _scheduler.start()
        logger.info("Scheduler started.")


def shutdown():
    if _scheduler.running:
        _scheduler.shutdown(wait=False)


def trigger_now(rat_name: str) -> bool:
    job = _scheduler.get_job(rat_name)
    if not job:
        return False
    job.func()
    return True


def list_jobs() -> list[dict]:
    jobs = []
    for job in _scheduler.get_jobs():
        if job.id.endswith("_boot"):
            continue
        jobs.append({
            "id": job.id,
            "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
        })
    return jobs
