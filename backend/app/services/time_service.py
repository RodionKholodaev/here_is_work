from datetime import datetime, timedelta
import pytz

class TimeService:
    @staticmethod
    def get_start_end_time(area: float, cleaning_rate: float = 100):
        """
        Args:
            area: площадь уборки в кв.м
            cleaning_rate: скорость уборки (кв.м/час), по умолчанию 100
        Returns:
            tuple: (время_начала, время_окончания)
        """
        # Время начала - текущее время в Москве
        moscow_tz = pytz.timezone('Europe/Moscow')
        start_time = datetime.now(moscow_tz)
        
        # Вычисляем время уборки в часах и добавляем к времени начала
        cleaning_duration = timedelta(hours=area / cleaning_rate)
        end_time = start_time + cleaning_duration
        
        return (start_time, end_time)