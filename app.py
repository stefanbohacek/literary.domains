# Import dependencies

from flask import Flask

# Import blueprints

from blueprints.humans import humans_blueprint
from blueprints.index import index_blueprint
from blueprints.favicon import favicon_blueprint
from blueprints.check_domain_availability import check_domain_availability_blueprint
from blueprints.generate_domain_names import generate_domain_names_blueprint
from blueprints.search_gutenberg import search_gutenberg_blueprint

# Set up main app

app = Flask(__name__)

# Register endpoints

app.register_blueprint(index_blueprint)
app.register_blueprint(search_gutenberg_blueprint)
app.register_blueprint(generate_domain_names_blueprint)
app.register_blueprint(check_domain_availability_blueprint)
app.register_blueprint(favicon_blueprint)
app.register_blueprint(humans_blueprint)

if __name__ == '__main__':
    app.run()
