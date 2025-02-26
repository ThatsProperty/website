from jira import JIRA

# import in jira connection config
from jira_config import get_jira_config
from jinja2 import Environment, FileSystemLoader


jira_url, jira_username, jira_token = get_jira_config()

# Connect to Jira API
jira = JIRA(server=jira_url, basic_auth=(jira_username, jira_token))

# Define your JQL query
jql_query = 'project = "LOCALAI" AND status = "Done" and labels in (customer_feedback) ORDER BY fixVersion asc'

# pass the query and get the issues
issues = jira.search_issues(jql_query)

# Collect release notes in a list
release_notes = []

########################## FIRST QUERY
for issue in issues:
    fix_versions = issue.fields.fixVersions
    release = ', '.join([version.name for version in fix_versions]) if fix_versions else 'Not assigned'
    release = release.split("Release")[1] if release else 'Not assigned'
    description_of_fix = issue.fields.customfield_10047 if issue.fields.customfield_10047 else 'Working on it!'
    description_of_fix = description_of_fix.replace(',', '').replace('^', '')
    customer_feedback = issue.fields.customfield_10049 if issue.fields.customfield_10049 else 'No customer feedback available'
    customer_feedback = customer_feedback.replace(',', '').replace('^', '')
    release_notes.append({
        'customer_feedback': customer_feedback,
        'description_of_fix': description_of_fix,
        'release': release
    })

######################### SECOND QUERY

# Define your JQL query
jql_query = 'project = "LOCALAI" AND status != "Done" and labels in (customer_feedback) ORDER BY fixVersion asc'

# Run the query and get the issues
issues = jira.search_issues(jql_query)

for issue in issues:
    fix_versions = issue.fields.fixVersions
    release = ', '.join([version.name for version in fix_versions]) if fix_versions else 'Not assigned'

    description_of_fix = issue.fields.customfield_10047 if issue.fields.customfield_10047 else 'Working on it!'
    description_of_fix = description_of_fix.replace(',', '').replace('^', '')

    customer_feedback = issue.fields.customfield_10049 if issue.fields.customfield_10049 else 'No customer feedback available'
    customer_feedback = customer_feedback.replace(',', '').replace('^', '')
    if issue.fields.status.name == "To Do":
        description_of_fix = "To Do"

    release = ', '.join([version.name.replace("Release ", "") for version in fix_versions]) if fix_versions else ''

    release_notes.append({
        'customer_feedback': customer_feedback,
        'description_of_fix': description_of_fix,
        'release': release
    })

# Set up Jinja2 environment and load template from current directory
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('release_notes_template.html')

# Render the template with release_notes data
rendered_html = template.render(release_notes=release_notes)

# Write the HTML to a file
with open('release_notes.html', 'w', encoding='utf-8') as f:
    f.write(rendered_html)

print("Release notes have been written to release_notes.html")




