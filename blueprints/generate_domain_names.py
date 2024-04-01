import os
from pathlib import Path
import json
from flask import Blueprint, request, jsonify
import public_domains

generate_domain_names_blueprint = Blueprint('generate_domain_names_blueprint', __name__)

@generate_domain_names_blueprint.route('/generate-domain-names')
def generate_domain_names():
    book = request.args.get('book').lower()
    book_text = public_domains.gutenberg(book)

    domains_file_path = f"data/domains/{book}.txt"
    book_text_file_path = f"data/books/{book}.txt"

    domains_file = Path(domains_file_path)

    if not domains_file.is_file():
        book_text_file = Path("/path/to/file")
        if not book_text_file.is_file():
            print("downloading book file...")
            with open(book_text_file_path, "w") as book_text_file:
                book_text_file.write(book_text)

        print("generating hosts...")
        hosts = public_domains.get_hosts(book_text_file_path, quiet=True)

        with open(domains_file_path, "w") as domains_file:
            # domains_file.write(hosts)
            domains_file.write(json.dumps(hosts, default=tuple))

        os.remove(book_text_file_path)
    else:
        print("using existing file")
        with open(domains_file_path, "r") as domains_file:
            hosts = json.load(domains_file)

    print(hosts)

    return jsonify(
        # hosts=list(hosts)
        list(hosts)
    )
