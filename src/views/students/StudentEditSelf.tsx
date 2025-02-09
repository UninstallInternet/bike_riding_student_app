import React, { useState, useEffect } from 'react'
import { Box, Avatar, Typography, Button, CircularProgress } from "@mui/material"
import { Camera } from 'lucide-react'
import { UserAuth } from '../../context/AuthContext';
import { fetchStudentbyId, Student, updateStudentPicture } from '../../lib/api';
import { StudentToolbar } from '../../components/StudentToolbar';
import { theme } from '../../theme/theme';

export const StudentEditSelf = () => {
  const { session } = UserAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [sucess, setSucess] = useState("")

  useEffect(() => {
    const loadStudent = async () => {
      if (session?.user?.id) {
        try {
          const data = await fetchStudentbyId(session.user.id)
          
          if (data && data.length > 0) {
            setStudent(data[0])
          } else {
            console.error('No student data found')
          }
        } catch (error) {
          console.error('Failed to fetch student data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadStudent()
  }, [session])
  

  const handlePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && student) {
      setUploading(true)
      try {
        const updatedStudent = await updateStudentPicture(student.id, file)
        setStudent(updatedStudent)
        setSucess("Picture updated successfully")
      } catch (error) {
        console.error('Failed to update picture:', error)
      } finally {
        setUploading(false)
      }
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No student data available.</Typography>
      </Box>
    )
  }

  return (
   <Box>
        <StudentToolbar title='Edit Profile'/>

    <Box sx={{ 
        p: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        boxShadow: 1,
        maxWidth: 400,
        margin: 'auto',
        mt: 4
    }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 500 }}>
        Profile
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={student.profile_pic_url || '/placeholder.svg'}
          alt={student.name}
          sx={{ width: 120, height: 120, mb: 2 }}
          />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handlePictureChange}
          />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            startIcon={<Camera size={20} />}
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width:"100%",
                p:2,
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
            }}
            disabled={uploading}
            >
            {uploading ? 'Uploading...' : 'Change Picture'}
          </Button>
        </label>
        <Typography color={theme.palette.green.main} sx={{mt:2, fontWeight:500}}>

        {sucess}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, p:2 }}>
          Name: {student.name}
        </Typography>
      </Box>
    </Box>
              </Box> 
  )
}
