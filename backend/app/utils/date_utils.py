"""
Date and time utility functions
"""
from datetime import datetime, date, time, timedelta
from typing import Optional, Tuple, List
import calendar
import pytz

class DateUtils:
    """Date and time utilities"""
    
    @staticmethod
    def get_current_utc() -> datetime:
        """Get current UTC datetime"""
        return datetime.utcnow()
    
    @staticmethod
    def format_datetime(dt: datetime, format: str = "%Y-%m-%d %H:%M:%S") -> str:
        """Format datetime to string"""
        return dt.strftime(format)
    
    @staticmethod
    def parse_date(date_str: str, format: str = "%Y-%m-%d") -> date:
        """Parse date string"""
        return datetime.strptime(date_str, format).date()
    
    @staticmethod
    def parse_datetime(dt_str: str, format: str = "%Y-%m-%d %H:%M:%S") -> datetime:
        """Parse datetime string"""
        return datetime.strptime(dt_str, format)
    
    @staticmethod
    def calculate_age(dob: date) -> int:
        """Calculate age from date of birth"""
        today = date.today()
        return today.year - dob.year - (
            (today.month, today.day) < (dob.month, dob.day)
        )
    
    @staticmethod
    def add_days(dt: datetime, days: int) -> datetime:
        """Add days to datetime"""
        return dt + timedelta(days=days)
    
    @staticmethod
    def add_hours(dt: datetime, hours: int) -> datetime:
        """Add hours to datetime"""
        return dt + timedelta(hours=hours)
    
    @staticmethod
    def add_minutes(dt: datetime, minutes: int) -> datetime:
        """Add minutes to datetime"""
        return dt + timedelta(minutes=minutes)
    
    @staticmethod
    def get_date_range(
        start: date, end: date
    ) -> List[date]:
        """Get list of dates between start and end"""
        dates = []
        current = start
        while current <= end:
            dates.append(current)
            current += timedelta(days=1)
        return dates
    
    @staticmethod
    def get_week_range(dt: date) -> Tuple[date, date]:
        """Get start and end of week"""
        start = dt - timedelta(days=dt.weekday())
        end = start + timedelta(days=6)
        return start, end
    
    @staticmethod
    def get_month_range(year: int, month: int) -> Tuple[date, date]:
        """Get start and end of month"""
        start = date(year, month, 1)
        last_day = calendar.monthrange(year, month)[1]
        end = date(year, month, last_day)
        return start, end
    
    @staticmethod
    def is_weekend(dt: date) -> bool:
        """Check if date is weekend"""
        return dt.weekday() >= 5
    
    @staticmethod
    def is_business_hours(
        dt: datetime,
        start_hour: int = 9,
        end_hour: int = 17
    ) -> bool:
        """Check if datetime is within business hours"""
        return start_hour <= dt.hour < end_hour and not DateUtils.is_weekend(dt.date())
    
    @staticmethod
    def get_days_between(d1: date, d2: date) -> int:
        """Get number of days between two dates"""
        return abs((d2 - d1).days)
    
    @staticmethod
    def get_next_date(
        start_date: date,
        days_of_week: List[int],
        num_occurrences: int = 1
    ) -> List[date]:
        """Get next occurrences of specific days of week"""
        dates = []
        current = start_date + timedelta(days=1)
        
        while len(dates) < num_occurrences:
            if current.weekday() in days_of_week:
                dates.append(current)
            current += timedelta(days=1)
        
        return dates
    
    @staticmethod
    def convert_timezone(
        dt: datetime,
        from_tz: str = "UTC",
        to_tz: str = "UTC"
    ) -> datetime:
        """Convert datetime between timezones"""
        from_zone = pytz.timezone(from_tz)
        to_zone = pytz.timezone(to_tz)
        
        dt = from_zone.localize(dt) if dt.tzinfo is None else dt
        return dt.astimezone(to_zone)
    
    @staticmethod
    def get_pregnancy_week(
        last_period_date: date
    ) -> int:
        """Calculate pregnancy week from last menstrual period"""
        today = date.today()
        days_since_lmp = (today - last_period_date).days
        return min(days_since_lmp // 7, 42)
    
    @staticmethod
    def get_expected_delivery_date(
        last_period_date: date
    ) -> date:
        """Calculate expected delivery date (40 weeks from LMP)"""
        return last_period_date + timedelta(days=280)
    
    @staticmethod
    def get_next_blood_donation_date(
        last_donation_date: date
    ) -> date:
        """Calculate next eligible blood donation date (90 days)"""
        return last_donation_date + timedelta(days=90)
    
    @staticmethod
    def get_prescription_expiry(prescribed_date: date) -> date:
        """Calculate prescription expiry (6 months)"""
        return prescribed_date + timedelta(days=180)