from sqlalchemy import (
    Column, ForeignKey, ForeignKeyConstraint, Integer,
    MetaData, String, Table,
)
from marshmallow import Schema, ValidationError, validates, validates_schema
from marshmallow.fields import Date, Dict, Float, Int, List, Nested, Str
from marshmallow.validate import Length, OneOf, Range

metadata = MetaData()

products_table = Table(
    'products', metadata,
    Column('id', Integer, primary_key=True),
    Column('name', String, nullable=False),
    Column('companyid', Integer, ForeignKey('companys.id'))
)

class Product(Schema):
    __tablename__ = 'products'

    id = Int()
    name = Str(validate=Length(min=3, max=50), required=True)
    companyid = Int(required=True)

    def __repr__(self):
        return "<Product(id='{0}', name='{1}', companyid='{2}')>".format(
            self.id, self.name, self.companyid )