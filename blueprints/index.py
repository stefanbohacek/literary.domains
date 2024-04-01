from flask import Blueprint, render_template
from cache import cache

index_blueprint = Blueprint('index_blueprint', __name__)

@index_blueprint.route("/")
@cache.cached(timeout=50)

def index():
    return render_template('index.html')
