import os
import re
import csv
from flask import Blueprint, request, jsonify
import public_domains

check_domain_availability_blueprint = Blueprint(
    'check_domain_availability_blueprint', __name__)


@check_domain_availability_blueprint.route('/check-domain-availability')
def check_domain_availability():
    domain = request.args.get('domain').lower()

    return jsonify(
        public_domains.available(domain)
    )
