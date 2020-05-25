
from .auth import AuthTest, AuthLogin, AuthRefresh
from .company import CompanyList, CompanyUpdate, CompanyDelete
from .product import ProductList, ProductUpdate, ProductDelete

# Кортеж всех доступных обработчиков
HANDLERS = ( 
    AuthTest, AuthLogin, AuthRefresh,
    CompanyList, CompanyUpdate, CompanyDelete,
    ProductList, ProductUpdate, ProductDelete
)

