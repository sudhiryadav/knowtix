import json
from fastapi.openapi.utils import get_openapi
import os

def generate_postman_collection(app):
    # Get OpenAPI schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )

    # Create Postman collection structure
    collection = {
        "info": {
            "name": "MyQuery API",
            "description": "API collection for the MyQuery document AI chatbot",
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        "item": [],
        "variable": [
            {
                "key": "base_url",
                "value": "http://localhost:8000",
                "type": "string"
            },
            {
                "key": "auth_token",
                "value": "your_auth_token_here",
                "type": "string",
                "description": "Get this token from the /users endpoint response"
            },
            {
                "key": "user_id",
                "value": "your_user_id_here",
                "type": "string",
                "description": "Get this ID from the /users endpoint response"
            },
            {
                "key": "session_id",
                "value": "your_session_id_here",
                "type": "string"
            }
        ]
    }

    # Group endpoints by tags
    endpoints_by_tag = {}
    for route in app.routes:
        if hasattr(route, "tags") and route.tags:
            for tag in route.tags:
                if tag not in endpoints_by_tag:
                    endpoints_by_tag[tag] = []
                endpoints_by_tag[tag].append(route)

    # Create Postman items for each tag
    for tag, routes in endpoints_by_tag.items():
        tag_item = {
            "name": tag.replace("_", " ").title(),
            "item": []
        }

        for route in routes:
            # Skip non-API routes
            if not hasattr(route, "methods"):
                continue

            # Create request item
            request_item = {
                "name": route.name.replace("_", " ").title(),
                "request": {
                    "method": list(route.methods)[0],
                    "header": [],
                    "url": {
                        "raw": f"{{{{base_url}}}}{route.path}",
                        "host": ["{{base_url}}"],
                        "path": route.path.strip("/").split("/")
                    },
                    "description": route.description if hasattr(route, "description") else ""
                }
            }

            # Add auth header if needed
            if any(dep for dep in route.dependencies if "get_user" in str(dep)):
                request_item["request"]["header"].append({
                    "key": "Authorization",
                    "value": "Bearer {{auth_token}}",
                    "description": "Required for authenticated endpoints"
                })

            # Special handling for file upload endpoint
            if route.path == "/upload":
                request_item["request"]["header"] = [
                    {
                        "key": "Authorization",
                        "value": "Bearer {{auth_token}}",
                        "description": "Required for authenticated endpoints"
                    }
                ]
                request_item["request"]["body"] = {
                    "mode": "formdata",
                    "formdata": [
                        {
                            "key": "files",
                            "type": "file",
                            "src": "/path/to/your/file.pdf",
                            "description": "Upload PDF or DOC files. Make sure you have set the auth_token in environment variables."
                        }
                    ]
                }
            # Add body for other POST/PUT endpoints
            elif route.methods == {"POST", "PUT"}:
                # Get request body model from route
                if hasattr(route, "body_field"):
                    model = route.body_field.type_
                    example = {}
                    for field_name, field in model.__fields__.items():
                        if field.default is not None:
                            example[field_name] = field.default
                        elif field.type_ == str:
                            example[field_name] = "string"
                        elif field.type_ == int:
                            example[field_name] = 0
                        elif field.type_ == bool:
                            example[field_name] = False
                        elif field.type_ == list:
                            example[field_name] = []
                        else:
                            example[field_name] = None

                    request_item["request"]["body"] = {
                        "mode": "raw",
                        "raw": json.dumps(example, indent=4)
                    }

            tag_item["item"].append(request_item)

        collection["item"].append(tag_item)

    # Save collection to file
    with open("myquery.postman_collection.json", "w") as f:
        json.dump(collection, f, indent=4)

if __name__ == "__main__":
    generate_postman_collection() 