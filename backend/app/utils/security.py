from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# инструмент шифрования
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    """
    Создает JWT токен, в нем пречем данные которые нам хочется удобно из него доставать
    """
    # Копируем данные (например, {'sub': 'user_id'}), чтобы не менять оригинал
    to_encode = data.copy()
    
    # Устанавливаем срок годности токена. 
    # В новых версиях Python лучше использовать datetime.now(timezone.utc)
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Добавляем поле "exp" (expiration time) в полезную нагрузку (payload)
    # По этому полю библиотека поймет, что токен "протух"
    to_encode.update({"exp": expire}) # добавляем в словарь время когда токен уже не действителен
    
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