import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///cinema_migrations.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False