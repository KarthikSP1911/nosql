# Neo4j Graph Schema Diagram

## 🎨 Visual Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                     ACADEMIA GRAPH DATABASE                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│    Student       │
├──────────────────┤
│ id: UUID         │◄────┐
│ name: String     │     │
│ email: String*   │     │
│ phone: String    │     │
│ createdAt: Date  │     │
│ updatedAt: Date  │     │
└──────────────────┘     │
         │               │
         │ ENROLLED_IN   │
         │ {enrolledAt}  │
         ▼               │
┌──────────────────┐     │
│     Course       │     │
├──────────────────┤     │
│ id: UUID         │     │
│ name: String     │     │
│ code: String*    │     │
│ credits: Integer │     │
│ createdAt: Date  │     │
│ updatedAt: Date  │     │
└──────────────────┘     │
         ▲               │
         │ TEACHES       │
         │ {assignedAt}  │
         │               │
┌──────────────────┐     │
│     Faculty      │     │
├──────────────────┤     │
│ id: UUID         │─────┘
│ name: String     │
│ email: String*   │
│ department: Str  │
│ createdAt: Date  │
│ updatedAt: Date  │
└──────────────────┘

* = Unique Constraint
```

## 📋 Node Labels

### Student
**Properties:**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `email` (String, Required, Unique)
- `phone` (String, Optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Outgoing Relationships:**
- `ENROLLED_IN` → Course

**Indexes:**
- Unique constraint on `email`
- Index on `id`

---

### Faculty
**Properties:**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `email` (String, Required, Unique)
- `department` (String, Required)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Outgoing Relationships:**
- `TEACHES` → Course

**Indexes:**
- Unique constraint on `email`
- Index on `id`

---

### Course
**Properties:**
- `id` (UUID, Primary Key)
- `name` (String, Required)
- `code` (String, Required, Unique)
- `credits` (Integer, Required)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Incoming Relationships:**
- Student → `ENROLLED_IN` → Course
- Faculty → `TEACHES` → Course

**Indexes:**
- Unique constraint on `code`
- Index on `id`

---

## 🔗 Relationship Types

### ENROLLED_IN
**Direction:** Student → Course
**Properties:**
- `enrolledAt` (DateTime) - When the enrollment was created

**Cardinality:** Many-to-Many
- One student can enroll in multiple courses
- One course can have multiple students

**Example:**
```cypher
(s:Student)-[:ENROLLED_IN {enrolledAt: datetime()}]->(c:Course)
```

---

### TEACHES
**Direction:** Faculty → Course
**Properties:**
- `assignedAt` (DateTime) - When the assignment was created

**Cardinality:** Many-to-Many
- One faculty can teach multiple courses
- One course can be taught by multiple faculty (though typically one)

**Example:**
```cypher
(f:Faculty)-[:TEACHES {assignedAt: datetime()}]->(c:Course)
```

---

## 🎯 Graph Patterns

### Pattern 1: Student's Course Schedule
```cypher
(s:Student)-[:ENROLLED_IN]->(c:Course)<-[:TEACHES]-(f:Faculty)
```
**Meaning:** Find all courses a student is enrolled in and their instructors

### Pattern 2: Faculty's Teaching Load
```cypher
(f:Faculty)-[:TEACHES]->(c:Course)<-[:ENROLLED_IN]-(s:Student)
```
**Meaning:** Find all courses a faculty teaches and their students

### Pattern 3: Course Enrollment
```cypher
(s:Student)-[:ENROLLED_IN]->(c:Course)
```
**Meaning:** Find all students enrolled in a specific course

### Pattern 4: Department Courses
```cypher
(f:Faculty {department: "Computer Science"})-[:TEACHES]->(c:Course)
```
**Meaning:** Find all courses taught by a specific department

---

## 📊 Sample Data Visualization

```
    [John Doe]──ENROLLED_IN──>[CS101: Intro to CS]
         │                           ▲
         │                           │
         │                      TEACHES
         │                           │
    ENROLLED_IN              [Dr. Smith]
         │                           │
         ▼                      TEACHES
    [MATH201: Calculus]               │
         ▲                           ▼
         │                    [CS301: Algorithms]
    ENROLLED_IN                       ▲
         │                           │
    [Jane Smith]──ENROLLED_IN────────┘
```

---

## 🔍 Query Examples

### Find Student's Courses with Instructors
```cypher
MATCH (s:Student {name: "John Doe"})-[:ENROLLED_IN]->(c:Course)
OPTIONAL MATCH (f:Faculty)-[:TEACHES]->(c)
RETURN s.name as student, 
       c.name as course, 
       c.code as code,
       f.name as instructor
```

### Find Faculty Workload
```cypher
MATCH (f:Faculty)-[:TEACHES]->(c:Course)
OPTIONAL MATCH (s:Student)-[:ENROLLED_IN]->(c)
RETURN f.name as faculty,
       f.department as department,
       count(DISTINCT c) as courses,
       count(DISTINCT s) as students
ORDER BY courses DESC
```

### Find Popular Courses
```cypher
MATCH (c:Course)
OPTIONAL MATCH (s:Student)-[:ENROLLED_IN]->(c)
RETURN c.name as course,
       c.code as code,
       count(s) as enrollments
ORDER BY enrollments DESC
LIMIT 10
```

---

## 🏗️ Schema Evolution

### Adding New Node Label
```cypher
CREATE (d:Department {
  id: randomUUID(),
  name: "Computer Science",
  building: "Engineering Hall",
  createdAt: datetime()
})
```

### Adding New Relationship
```cypher
MATCH (f:Faculty {id: $facultyId})
MATCH (d:Department {name: $departmentName})
CREATE (f)-[:BELONGS_TO]->(d)
```

### Adding Property to Existing Nodes
```cypher
MATCH (s:Student)
SET s.graduationYear = 2025
```

---

## 🔐 Constraints and Indexes

### Unique Constraints
```cypher
CREATE CONSTRAINT student_email_unique IF NOT EXISTS
FOR (s:Student) REQUIRE s.email IS UNIQUE;

CREATE CONSTRAINT faculty_email_unique IF NOT EXISTS
FOR (f:Faculty) REQUIRE f.email IS UNIQUE;

CREATE CONSTRAINT course_code_unique IF NOT EXISTS
FOR (c:Course) REQUIRE c.code IS UNIQUE;
```

### Performance Indexes
```cypher
CREATE INDEX student_id_index IF NOT EXISTS
FOR (s:Student) ON (s.id);

CREATE INDEX faculty_id_index IF NOT EXISTS
FOR (f:Faculty) ON (f.id);

CREATE INDEX course_id_index IF NOT EXISTS
FOR (c:Course) ON (c.id);

CREATE INDEX faculty_department_index IF NOT EXISTS
FOR (f:Faculty) ON (f.department);
```

---

## 📈 Comparison: MongoDB vs Neo4j

| Aspect | MongoDB | Neo4j |
|--------|---------|-------|
| **Data Model** | Document (JSON) | Graph (Nodes + Relationships) |
| **Relationships** | Embedded or Referenced | First-class citizens |
| **Queries** | Aggregation Pipeline | Cypher Query Language |
| **IDs** | ObjectId | UUID (custom) |
| **Joins** | $lookup (expensive) | Native traversal (fast) |
| **Schema** | Flexible | Flexible with constraints |
| **Best For** | Hierarchical data | Connected data |

---

## 🎓 Best Practices

1. **Use UUIDs for IDs** - More portable than auto-increment
2. **Index frequently queried properties** - Improves performance
3. **Use MERGE for relationships** - Prevents duplicates
4. **Limit query results** - Use LIMIT for large datasets
5. **Use parameters** - Prevents injection, enables caching
6. **Profile queries** - Use EXPLAIN and PROFILE
7. **Batch operations** - Use UNWIND for bulk inserts
8. **Clean up relationships** - Use DETACH DELETE

---

## 🚀 Next Steps

1. Explore advanced Cypher queries
2. Implement full-text search
3. Add more relationship types
4. Create graph algorithms (shortest path, etc.)
5. Implement role-based access control
6. Add audit logging
7. Create data visualization dashboards
