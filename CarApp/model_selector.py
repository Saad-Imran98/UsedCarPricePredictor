from enum import Enum

"""
Enum for selecting supported models in this app.
"""
class ModelSelector(Enum):
    XG_BOOST = "XG_BOOST"
    RANDOM_FOREST = "RANDOM_FOREST"
    DECISION_TREE = "DECISION_TREE"
    NEURAL_NETWORK = "NEURAL_NETWORK"
