from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# инструмент шифрования
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Принимает "сырой" пароль и превращает его в нечитаемый хеш.
    Хеш включает в себя 'соль' (случайные данные), поэтому даже
    одинаковые пароли у разных юзеров будут выглядеть в БД по-разному.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Сравнивает введенный пароль с тем, что лежит в базе.
    Внутри происходит магия: passlib берет соль из хеша, подсаливает 
    введенный пароль и проверяет, совпал ли результат.
    """
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    """
    Создает JWT (JSON Web Token) — цифровой "пропуск" для пользователя.
    """
    # Копируем данные (например, {'sub': 'user_id'}), чтобы не менять оригинал
    to_encode = data.copy()
    
    # Устанавливаем срок годности токена. 
    # В новых версиях Python лучше использовать datetime.now(timezone.utc)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Добавляем поле "exp" (expiration time) в полезную нагрузку (payload)
    # По этому полю библиотека поймет, что токен "протух"
    to_encode.update({"exp": expire})
    
    # Финальный этап: склеиваем данные и подписываем их нашим SECRET_KEY.
    # Если кто-то изменит хоть один символ в токене, подпись станет невалидной.
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    try:
        # jwt.decode делает две вещи сразу:
        # 1. Проверяет подпись (не изменил ли кто-то данные внутри)
        # 2. Проверяет срок годности "exp" (не протух ли токен)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Если всё ок, возвращаем словарь с данными (например, {"sub": "123", "exp": ...})
        return payload
        
    except JWTError:
        # Если подпись неверна или срок истек, выкидываем ошибку
        raise HTTPException(status_code=401, detail="Could not validate credentials")