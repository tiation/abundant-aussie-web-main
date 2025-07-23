package com.tiation.riggerhire.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.ui.theme.RiggerHireTheme
import com.tiation.riggerhire.ui.auth.LoginActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RiggerHireTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF0D0D0D)
                ) {
                    MainScreen()
                }
            }
        }
    }
    
    @Composable
    fun MainScreen() {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "RiggerConnect",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF00FFFF)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Welcome to RiggerConnect App",
                fontSize = 18.sp,
                color = Color(0xFFB3B3B3)
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = {
                    startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF00FFFF)
                )
            ) {
                Text(
                    text = "Get Started",
                    color = Color(0xFF0D0D0D),
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}
