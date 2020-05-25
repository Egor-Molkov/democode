from sqlalchemy import (
    Column, ForeignKey, ForeignKeyConstraint, Integer,
    MetaData, String, Table,
)
from marshmallow import Schema, ValidationError, validates, validates_schema
from marshmallow.fields import Date, Dict, Float, Int, List, Nested, Str
from marshmallow.validate import Length, OneOf, Range

metadata = MetaData()

companys_table = Table(
    'companys', metadata,
    Column('id', Integer, primary_key=True ),
    Column('name', String, nullable=False),
)

class Company(Schema):
    __tablename__ = 'companys'

    id = Int()
    name = Str(validate=Length(min=3, max=50), required=True)

    def __repr__(self):
        return "<Company(id='{0}', name='{1}')>".format( self.id, self.name )

