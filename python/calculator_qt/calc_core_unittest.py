import doctest
import unittest
import calc_core

def load_tests( loader, tests, ignore ):
    tests.addTests( doctest.DocTestSuite( calc_core ))
    return tests

unittest.main( verbosity=2 )
