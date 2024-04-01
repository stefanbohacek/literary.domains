import os
import re
import csv
from flask import Blueprint, request, jsonify

search_gutenberg_blueprint = Blueprint('search_gutenberg_blueprint', __name__)


@search_gutenberg_blueprint.route('/search-gutenberg')
def search_gutenberg():
    # TODO: Check if the existing pg_catalog.csv file is older than one day and if so,
    # download it again from https://www.gutenberg.org/cache/epub/feeds/pg_catalog.csv

    query = request.args.get('query').lower()
    result_ids = []
    results = []

    with open('data/pg_catalog.csv', newline='') as pg_catalog:
        reader = csv.DictReader(pg_catalog)
        for book in reader:
            book_authors = [re.sub(r", \d*-\d*", "", author).strip()
                            for author in book["Authors"].split(";")]

            book_authors = [re.sub(r" \[.*\]", "", author)
                            for author in book_authors]

            book_title = re.sub(r" \[.*\]", "", book["Title"].strip())

            book_authors_lower = book_authors[0].lower()
            book_title_lower = book_title.lower()

            # if (query in book_authors_lower or query in book_title_lower):
            if (all(word in book_authors_lower for word in query.split(" ")) or all(word in book_title_lower for word in query.split(" "))):
                result_id = book_authors_lower + book_title_lower
                if (not result_id in result_ids):
                    result_ids.append(result_id)
                    results.append({
                        "title": book_title,
                        "authors": book_authors
                    })

    return jsonify(
        results=results
    )
