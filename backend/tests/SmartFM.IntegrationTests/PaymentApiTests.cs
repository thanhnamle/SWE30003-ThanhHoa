using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Payments;
using SmartFM.Domain.Enums;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for the Payments API controller.
/// </summary>
public class PaymentApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PaymentApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ProcessPayment_ValidRequest_ShouldReturn_200OK_AndReceiptDetails()
    {
        // Arrange
        var request = new ProcessPaymentDto
        {
            Amount = 500m, // unpaid invoice has 500m amount
            Method = PaymentMethod.BankTransfer
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoiceUnpaidId}", request);
        var content = await response.Content.ReadAsStringAsync();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK, $"Response content: {content}");

        var result = await response.Content.ReadFromJsonAsync<PaymentResponseDto>();
        result.Should().NotBeNull();
        result!.Status.Should().Be(PaymentStatus.Success);
        result.Message.Should().Be("Thanh toán thành công và Biên lai đã được xuất!");
        result.PaymentId.Should().NotBeEmpty();
        result.ReceiptId.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ProcessPayment_InsufficientAmount_ShouldReturn_400BadRequest()
    {
        // Arrange
        var request = new ProcessPaymentDto
        {
            Amount = 499.99m, // Less than 500m
            Method = PaymentMethod.CreditCard
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoiceUnpaidInsufficientId}", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ProcessPayment_AlreadyPaidInvoice_ShouldReturn_400BadRequest()
    {
        // Arrange
        var request = new ProcessPaymentDto
        {
            Amount = 300m,
            Method = PaymentMethod.EWallet
        };

        // Act
        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoicePaidId}", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
