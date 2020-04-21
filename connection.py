import cx_Oracle

class Connection():

    def __init__(self):
        self.connection = cx_Oracle.connect("system", "oracle", "0.0.0.0:1521/orcl")

    def get_all_tasks(self):
        cursor=self.connection.cursor()
        cursor.execute("SELECT * FROM task")
        tasks = {}
        for taskno, desc in cursor:
            tasks['taskno'] = taskno
            tasks[taskno] = {'description': desc}

        cursor.close()
        return tasks

    def close_connection(self):
        self.connection.close()


if __name__ == '__main__':
   testQuery = Connection()
   tasks = testQuery.get_all_tasks()
   print(tasks)
   testQuery.close_connection()
