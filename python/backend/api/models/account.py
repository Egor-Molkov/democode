from sqlalchemy import (
    Column, ForeignKey, ForeignKeyConstraint, Integer,
    MetaData, String, Table,
)
from marshmallow import Schema, ValidationError, validates, validates_schema
from marshmallow.fields import Date, Dict, Float, Int, List, Nested, Str
from marshmallow.validate import Length, OneOf, Range


accounts_table = Table(
    'accounts',
    MetaData(bind=None),
    Column('id', Integer, primary_key=True),
    Column('login', String, nullable=False),
    Column('password', String, nullable=False),
    Column('politics', String, nullable=False),
)

class Account(Schema):
    __tablename__ = 'accounts'

    id = Int()
    login = Str(validate=Length(min=3, max=50), required=True)
    password = Str(validate=Length(min=3, max=50), required=True)
    politics = Str(validate=Length(min=3, max=50), required=True)

    def __repr__(self):
        return "<account(id='{0}', login='{1}', password='{2}', politics='{3}')>".format(
            self.id, self.login[:2]+"***"+self.login[-2:], "***", self.politics )