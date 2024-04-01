from flask import Blueprint, current_app

humans_blueprint = Blueprint('humans_blueprint', __name__)

@humans_blueprint.route("/humans.txt")
def humans():
	return current_app.send_static_file('humans.txt')
