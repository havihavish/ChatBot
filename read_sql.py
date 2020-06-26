import mysql.connector

config = {
  'user': 'admin',
  'password': 'admin123',
  'host': 'database-1.ckfrthkfetwy.us-east-1.rds.amazonaws.com',
  'database': 'winsupply',
  'raise_on_warnings': True
}

cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()

query = ("SELECT color FROM winsupply.bathroom_faucets")


cursor.execute(query)

for (first_name) in cursor:
  print(first_name)
  # print("{}, {} was hired on {}".format(
  #   lastfirst_name, hire_date))

cursor.close()
cnx.close()